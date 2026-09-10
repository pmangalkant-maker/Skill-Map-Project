import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { GoogleGenAI, Type } from "@google/genai";
import { dataStore } from "../services/dataStore.js";
import Resume from "../models/Resume.js";
import zlib from "zlib";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

/**
 * Extracts searchable text from uploaded resume documents (PDF, DOCX, DOC, TXT)
 */
function decodePdfLiteralString(value) {
  let out = "";
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const next = value[++i];
    if (next === "n") out += "\n";
    else if (next === "r") out += "\r";
    else if (next === "t") out += "\t";
    else if (next === "b") out += "\b";
    else if (next === "f") out += "\f";
    else if (next === "\\" || next === "(" || next === ")") out += next;
    else if (/^[0-7]$/.test(next || "")) {
      let oct = next;
      while (oct.length < 3 && /^[0-7]$/.test(value[i + 1] || "")) oct += value[++i];
      out += String.fromCharCode(parseInt(oct, 8));
    } else {
      out += next || "";
    }
  }
  return out;
}

function extractPdfTextFallback(buffer) {
  // Last-resort extractor for simple/text PDFs. It is intentionally used
  // only when pdf-parse returns no usable text. It handles both plain and
  // Flate-compressed content streams and the common Tj/TJ text operators.
  const source = buffer.toString("latin1");
  const chunks = [];
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;

  while ((match = streamRegex.exec(source))) {
    let data = Buffer.from(match[1], "latin1");
    try {
      data = zlib.inflateSync(data);
    } catch {
      // Not every PDF stream is compressed; keep the original bytes.
    }
    chunks.push(data.toString("latin1"));
  }

  const content = chunks.join("\n");
  const textParts = [];
  const operatorRegex = /\((?:\\.|[^\\)])*\)\s*Tj|\[(?:[\s\S]*?)\]\s*TJ/g;
  let op;
  while ((op = operatorRegex.exec(content))) {
    const token = op[0];
    if (token.endsWith("Tj")) {
      const start = token.indexOf("(");
      const end = token.lastIndexOf(") Tj");
      if (start >= 0 && end > start) textParts.push(decodePdfLiteralString(token.slice(start + 1, end)));
    } else {
      const body = token.slice(1, token.lastIndexOf("]"));
      const strings = body.match(/\((?:\\.|[^\\)])*\)/g) || [];
      textParts.push(strings.map((x) => decodePdfLiteralString(x.slice(1, -1))).join(" "));
    }
  }

  return textParts.join("\n").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ").replace(/ {2,}/g, " ").trim();
}


async function extractPdfTextWithPdfJs(buffer) {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
      useSystemFonts: true
    });
    const pdf = await loadingTask.promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => (typeof item?.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (pageText) pages.push(pageText);
    }
    return pages.join("\n").trim();
  } catch (err) {
    console.warn("PDF.js extraction warning:", err.message || err);
    return "";
  }
}

function decodePdfHex(bytes) {
  if (!bytes?.length) return "";
  // UTF-16BE with BOM
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    const swapped = Buffer.alloc(bytes.length - 2);
    for (let i = 2; i + 1 < bytes.length; i += 2) {
      swapped[i - 2] = bytes[i + 1];
      swapped[i - 1] = bytes[i];
    }
    return swapped.toString("utf16le");
  }
  return bytes.toString("latin1");
}

function extractPdfHexStrings(content) {
  const parts = [];
  const regex = /<([0-9A-Fa-f\s]+)>\s*(?:Tj|TJ)/g;
  let match;
  while ((match = regex.exec(content))) {
    const hex = match[1].replace(/\s+/g, "");
    if (!hex || hex.length % 2 !== 0) continue;
    const value = decodePdfHex(Buffer.from(hex, "hex"));
    if (value.trim()) parts.push(value);
  }
  return parts.join("\n");
}

function extractPdfHexFromBuffer(buffer) {
  const source = buffer.toString("latin1");
  const chunks = [source];
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  while ((match = streamRegex.exec(source))) {
    let data = Buffer.from(match[1], "latin1");
    try {
      data = zlib.inflateSync(data);
      chunks.push(data.toString("latin1"));
    } catch {
      // uncompressed stream
    }
  }
  return chunks.map(extractPdfHexStrings).filter(Boolean).join("\n").trim();
}

async function extractPdfTextWithSystemTool(filePath) {
  // Optional final fallback. If Poppler's pdftotext is installed, it is
  // extremely reliable for text PDFs. The app never requires it.
  try {
    const command = process.platform === "win32" ? "pdftotext.exe" : "pdftotext";
    const { stdout } = await execFileAsync(command, ["-layout", "-enc", "UTF-8", filePath], {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024
    });
    return (stdout || "").replace(/\r/g, "").trim();
  } catch {
    return "";
  }
}

async function extractTextFromResume(resume) {
  if (!resume?.path) {
    console.warn("Resume extraction: database record has no file path.");
    return "";
  }

  const resolvedPath = path.isAbsolute(resume.path)
    ? resume.path
    : path.resolve(process.cwd(), resume.path);

  if (!fs.existsSync(resolvedPath)) {
    console.warn("Resume extraction: file does not exist:", resolvedPath);
    return "";
  }

  const ext = path.extname(resume.originalName || resolvedPath).toLowerCase();
  const mime = (resume.mimeType || "").toLowerCase();

  if (ext === ".pdf" || mime === "application/pdf") {
    const buffer = fs.readFileSync(resolvedPath);
    const attempts = [];

    // 1) pdf-parse
    try {
      const parser = typeof pdfParse === "function" ? pdfParse : pdfParse?.default;
      if (typeof parser === "function") {
        const result = await parser(buffer);
        if (result?.text?.trim()) return result.text.trim();
        attempts.push("pdf-parse returned empty text");
      } else {
        attempts.push("pdf-parse function unavailable");
      }
    } catch (err) {
      attempts.push(`pdf-parse: ${err.message || err}`);
      console.warn("PDF parsing warning:", err.message || err);
    }

    // 2) PDF.js — standards-based extraction for modern PDFs/font maps.
    const pdfJsText = await extractPdfTextWithPdfJs(buffer);
    if (pdfJsText.length >= 10) return pdfJsText;

    // 3) Decompressed Tj/TJ text operators.
    const fallbackText = extractPdfTextFallback(buffer);
    if (fallbackText.length >= 10) return fallbackText;

    // 4) Hex strings, including inside compressed streams.
    const hexText = extractPdfHexFromBuffer(buffer);
    if (hexText.length >= 10) return hexText.replace(/\s+/g, " ").trim();

    // 5) Optional Poppler installation, if available on the machine.
    const systemText = await extractPdfTextWithSystemTool(resolvedPath);
    if (systemText.length >= 10) return systemText;

    console.warn("All local PDF extraction methods failed:", attempts.join(" | "));
    return "";
  }

  if (
    ext === ".docx" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ path: resolvedPath });
      return result?.value?.trim() || "";
    } catch (err) {
      console.warn("DOCX parsing warning:", err.message || err);
      return "";
    }
  }

  if (ext === ".doc" || mime === "application/msword") {
    try {
      const buffer = fs.readFileSync(resolvedPath);
      const text = buffer.toString("latin1").replace(/[^\x20-\x7E\t\r\n]/g, " ");
      return text.trim();
    } catch (err) {
      console.warn("DOC parsing warning:", err.message || err);
      return "";
    }
  }

  try {
    return fs.readFileSync(resolvedPath, "utf8").trim();
  } catch (err) {
    console.warn("Plain text reading warning:", err.message || err);
    return "";
  }
}

/**
 * Invokes the Gemini API using @google/genai SDK with structured JSON output schema
 */
async function callGeminiForSkillExtraction(ai, resumeText, fileName) {
  const prompt = `You are a certified technical talent assessor and resume analyzer.
Analyze the following candidate resume document thoroughly.
Extract all identifiable technical, professional, architectural, cloud, database, developer tooling, and collaborative workplace skills.

For each skill, extract:
- name: Standardized skill title (e.g., "React", "TypeScript", "Node.js", "Docker", "AWS", "PostgreSQL", "CI/CD", "Agile Collaboration").
- category: A concise domain category such as "Frontend", "Backend", "Cloud & DevOps", "Database", "Programming Languages", "Tools & Technologies", or "Soft Skills".
- level: Estimated proficiency level strictly based on evidence: "Beginner", "Intermediate", or "Advanced".
- source: "resume"

CANDIDATE RESUME (${fileName}):
${resumeText}
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Standardized name of the skill" },
            category: { type: Type.STRING, description: "Domain category e.g. Frontend, Backend, Cloud & DevOps, Soft Skills" },
            level: { type: Type.STRING, description: "Proficiency level: Beginner, Intermediate, or Advanced" },
            source: { type: Type.STRING, description: "Origin of extraction, must be 'resume'" }
          },
          required: ["name", "category", "level", "source"]
        }
      }
    },
    required: ["skills"]
  };

  const configuredModel = (process.env.GEMINI_MODEL || "").trim();
  const modelsToTry = Array.from(new Set([
    configuredModel,
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash"
  ].filter(Boolean)));
  let lastError;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return response;
    } catch (err) {
      console.warn(`Gemini API attempt with ${model} failed:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError;
}


async function callGeminiForResumeFile(ai, filePath, fileName, mimeType) {
  const schema = {
    type: Type.OBJECT,
    properties: {
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            level: { type: Type.STRING },
            source: { type: Type.STRING }
          },
          required: ["name", "category", "level", "source"]
        }
      }
    },
    required: ["skills"]
  };

  const uploaded = await ai.files.upload({
    file: filePath,
    config: { mimeType: mimeType || "application/pdf", displayName: fileName || "resume" }
  });

  if (!uploaded?.uri) {
    throw new Error("Gemini did not return a file URI after resume upload.");
  }

  const configuredModel = (process.env.GEMINI_MODEL || "").trim();
  const modelsToTry = Array.from(new Set([
    configuredModel,
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash"
  ].filter(Boolean)));

  const prompt = `Analyze this resume document and extract ALL clearly supported technical and professional skills.
Return JSON only using the provided schema.
Rules:
- Do not invent skills.
- Normalize common names (Node.js, React, MongoDB, PostgreSQL, AWS, Docker, Git, etc.).
- category should be concise, such as Frontend, Backend, Programming Languages, Database, Cloud & DevOps, Tools & Technologies, or Soft Skills.
- level must be exactly Beginner, Intermediate, or Advanced and must be based only on evidence in the resume.
- source must be exactly "resume".`;

  let lastError;
  for (const model of modelsToTry) {
    try {
      return await ai.models.generateContent({
        model,
        contents: [
          { fileData: { fileUri: uploaded.uri, mimeType: uploaded.mimeType || mimeType || "application/pdf" } },
          { text: prompt }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
    } catch (err) {
      lastError = err;
      console.warn(`Gemini direct-file attempt with ${model} failed:`, err.message || err);
    }
  }
  throw lastError || new Error("Gemini direct-file extraction failed.");
}


const RESUME_SKILL_PATTERNS = [
  { names: ["TypeScript", "TypeScript & Modern JavaScript"], category: "Technical Skills" },
  { names: ["JavaScript", "JavaScript & ES6+"], category: "Technical Skills" },
  { names: ["React", "React Ecosystem & Next.js"], category: "Technical Skills" },
  { names: ["Next.js", "React Ecosystem & Next.js"], category: "Technical Skills" },
  { names: ["Node.js", "Node.js & Express REST APIs"], category: "Technical Skills" },
  { names: ["Express", "Node.js & Express REST APIs"], category: "Technical Skills" },
  { names: ["Python", "Python & Algorithmic Problem Solving"], category: "Technical Skills" },
  { names: ["Java", "Java Programming"], category: "Technical Skills" },
  { names: ["C++", "C++ Programming"], category: "Technical Skills" },
  { names: ["SQL", "SQL & Relational Databases"], category: "Other Skills" },
  { names: ["PostgreSQL", "PostgreSQL & Relational Data Modeling"], category: "Other Skills" },
  { names: ["MongoDB", "MongoDB & NoSQL"], category: "Other Skills" },
  { names: ["AWS", "Cloud Infrastructure (GCP / AWS)"], category: "Tools & Technologies" },
  { names: ["GCP", "Cloud Infrastructure (GCP / AWS)"], category: "Tools & Technologies" },
  { names: ["Google Cloud", "Cloud Infrastructure (GCP / AWS)"], category: "Tools & Technologies" },
  { names: ["Docker", "Docker & Containerization"], category: "Tools & Technologies" },
  { names: ["Kubernetes", "Kubernetes Orchestration"], category: "Tools & Technologies" },
  { names: ["Git", "Git Version Control & Code Review"], category: "Tools & Technologies" },
  { names: ["GitHub Actions", "CI/CD Pipelines & GitHub Actions"], category: "Tools & Technologies" },
  { names: ["CI/CD", "CI/CD Pipelines & GitHub Actions"], category: "Tools & Technologies" },
  { names: ["Tailwind", "Tailwind CSS & Design Systems"], category: "Technical Skills" },
  { names: ["Figma", "Figma & UI Design"], category: "Technical Skills" },
  { names: ["REST API", "Node.js & Express REST APIs"], category: "Technical Skills" },
  { names: ["GraphQL", "GraphQL & API Design"], category: "Technical Skills" },
  { names: ["Machine Learning", "Machine Learning"], category: "Technical Skills" },
  { names: ["TensorFlow", "TensorFlow"], category: "Technical Skills" },
  { names: ["PyTorch", "PyTorch"], category: "Technical Skills" },
  { names: ["Agile", "Agile & Technical Collaboration"], category: "Soft Skills" },
  { names: ["Scrum", "Agile & Technical Collaboration"], category: "Soft Skills" },
  { names: ["Communication", "Communication & Collaboration"], category: "Soft Skills" },
  { names: ["Leadership", "Leadership & Collaboration"], category: "Soft Skills" },
  { names: ["System Design", "System Design & Distributed Scalability"], category: "Other Skills" },
  { names: ["Microservices", "Microservices Architecture"], category: "Other Skills" },
  { names: ["OWASP", "Web Security & OWASP Standards"], category: "Other Skills" },
];

function buildFallbackSkills(text) {
  const lower = text.toLowerCase();
  const found = new Map();
  for (const rule of RESUME_SKILL_PATTERNS) {
    if (rule.names.some((n) => lower.includes(n.toLowerCase()))) {
      const name = rule.names[1] || rule.names[0];
      const evidence = rule.names.find((n) => lower.includes(n.toLowerCase())) || rule.names[0];
      found.set(name.toLowerCase(), {
        name,
        category: rule.category,
        level: "Intermediate",
        source: "resume",
        evidence
      });
    }
  }
  return Array.from(found.values());
}

function buildResumeSummary(text, fileName, skills) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d[\d .()\-]{7,}\d)/);
  const headings = lines.filter((line) => /^(education|experience|work experience|projects|certifications|skills|technical skills|internships?)/i.test(line));
  const education = lines.find((line) => /b\.?tech|b\.?e\.?|bachelor|master|m\.?tech|m\.?s\.?|university|college|computer science|engineering/i.test(line)) || "Not clearly identified";
  const experienceLines = lines.filter((line) => /intern|developer|engineer|analyst|designer|experience|worked|built|developed/i.test(line));
  const certifications = lines.filter((line) => /certif|aws certified|azure|google cloud|coursera|udemy|nptel/i.test(line)).slice(0, 6);
  const projects = lines.filter((line) => /project|built|developed|implemented|application|platform|system/i.test(line)).slice(0, 8);
  return {
    fileName,
    candidateName: lines[0] || "Candidate",
    email: emailMatch?.[0] || "Not identified",
    phone: phoneMatch?.[0] || "Not identified",
    education,
    experienceHighlights: experienceLines.slice(0, 6),
    certifications,
    projects,
    detectedSections: headings,
    skillsDetected: skills.map((s) => s.name),
    textCharacters: text.length
  };
}

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume document is required. Please upload a PDF, DOCX, or TXT file."
      });
    }

    // Remove existing user resume file if present
    const oldResume = await dataStore.getResumeByUserId(req.userId);
    if (oldResume?.path && fs.existsSync(oldResume.path)) {
      try {
        fs.unlinkSync(oldResume.path);
      } catch (err) {
        console.warn("Could not delete old resume file:", err.message);
      }
    }
    if (oldResume) {
      await dataStore.deleteResume(req.userId);
    }

    const resume = await dataStore.saveResume({
      userId: req.userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: {
        id: (resume._id || resume.id || "res-current").toString(),
        fileName: resume.originalName,
        fileSize: resume.size,
        mimeType: resume.mimeType,
        uploadedAt: resume.createdAt || new Date(),
        processingAvailable: true
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    const resume = await dataStore.getResumeByUserId(req.userId);
    if (!resume) {
      return res.json({ success: true, resume: null });
    }

    res.json({
      success: true,
      resume: {
        id: (resume._id || resume.id || "res-current").toString(),
        fileName: resume.originalName,
        fileSize: resume.size,
        mimeType: resume.mimeType,
        uploadedAt: resume.createdAt || new Date(),
        processingAvailable: true
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteResume(req, res, next) {
  try {
    const resume = await dataStore.getResumeByUserId(req.userId);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    if (fs.existsSync(resume.path)) {
      try {
        fs.unlinkSync(resume.path);
      } catch (err) {
        console.warn("Could not remove file:", err.message);
      }
    }
    await dataStore.deleteResume(req.userId);

    res.json({ success: true, message: "Resume removed successfully" });
  } catch (error) {
    next(error);
  }
}

export async function extractSkills(req, res, next) {
  try {
    const resume = await dataStore.getResumeByUserId(req.userId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No uploaded resume found for this user. Please upload a resume first."
      });
    }

    if (!resume.path || !fs.existsSync(resume.path)) {
      return res.status(404).json({
        success: false,
        message: "The uploaded resume file was not found on the server storage. Please re-upload your resume."
      });
    }

    // Resolve the stored path once. Relative multer paths are resolved from
    // the backend working directory so extraction works consistently on Windows.
    const resolvedResumePath = path.isAbsolute(resume.path)
      ? resume.path
      : path.resolve(process.cwd(), resume.path);

    // First try local text extraction. If that fails, send the original PDF/DOCX
    // directly to Gemini so scanned/encoded PDFs can still be analyzed.
    const resumeText = await extractTextFromResume({ ...resume, path: resolvedResumePath });

    let parsed = null;
    let aiMode = "deterministic-fallback";
    const ai = getGeminiClient();

    if (resumeText && resumeText.length >= 10 && ai) {
      try {
        const geminiResponse = await callGeminiForSkillExtraction(ai, resumeText, resume.originalName);
        const responseText = geminiResponse.text?.trim();
        if (responseText) {
          parsed = JSON.parse(responseText);
          aiMode = "gemini-ai";
        }
      } catch (geminiError) {
        console.warn("Gemini text extraction unavailable; continuing with deterministic extraction:", geminiError.message || geminiError);
      }
    }

    if ((!parsed || !Array.isArray(parsed.skills)) && ai) {
      try {
        const directResponse = await callGeminiForResumeFile(
          ai,
          resolvedResumePath,
          resume.originalName,
          resume.mimeType
        );
        const responseText = directResponse.text?.trim();
        if (responseText) {
          parsed = JSON.parse(responseText);
          aiMode = "gemini-file";
        }
      } catch (geminiFileError) {
        console.warn("Gemini direct-file resume analysis unavailable:", geminiFileError.message || geminiFileError);
      }
    }

    // Deterministic extraction only needs readable text. It is the final fallback.
    if (!parsed || !Array.isArray(parsed.skills)) {
      if (!resumeText || resumeText.length < 10) {
        return res.status(400).json({
          success: false,
          message: ai
            ? "Resume was uploaded, but neither the local PDF/DOCX parser nor Gemini could read it. Please re-upload the file."
            : "Resume was uploaded, but this server could not read its text. Add GEMINI_API_KEY to enable direct PDF/DOCX analysis, then re-upload the resume."
        });
      }
      parsed = { skills: buildFallbackSkills(resumeText) };
    }

    // Persist extracted text for subsequent analysis and auditing.
    try {
      if (dataStore.isMongoConnected() && resume._id) {
        await Resume.findByIdAndUpdate(resume._id, { extractedText: resumeText });
      } else if (resume) {
        resume.extractedText = resumeText;
      }
    } catch (saveTextErr) {
      console.warn("Could not persist extracted resume text:", saveTextErr.message);
    }

    // Validate, sanitize, and deduplicate extracted skills
    const validatedSkills = [];
    const seenNames = new Set();
    const validLevels = ["Beginner", "Intermediate", "Advanced"];

    for (const item of parsed.skills) {
      if (!item || typeof item.name !== "string") continue;
      const cleanName = item.name.trim();
      if (!cleanName || cleanName.length < 2) continue;

      const lowerName = cleanName.toLowerCase();
      if (seenNames.has(lowerName)) continue;
      seenNames.add(lowerName);

      const normalizedLevel = validLevels.includes(item.level) ? item.level : "Intermediate";
      const cleanCategory = (typeof item.category === "string" && item.category.trim())
        ? item.category.trim()
        : "Technical Skills";
      const score = normalizedLevel === "Advanced" ? 85 : normalizedLevel === "Intermediate" ? 70 : 50;

      validatedSkills.push({
        name: cleanName,
        category: cleanCategory,
        level: normalizedLevel,
        score,
        source: "resume",
        isAiExtracted: true,
        aiConfidence: 90,
        confirmedByCandidate: false
      });
    }

    if (validatedSkills.length === 0) {
      return res.status(422).json({
        success: false,
        message: "No identifiable technical or professional skills could be extracted from this document."
      });
    }

    // Save extracted skills to authenticated candidate profile in MongoDB/dataStore
    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Authenticated candidate record not found." });
    }

    if (!user.skills) user.skills = [];

    // Deduplicate against existing user skills and update/append
    for (const extracted of validatedSkills) {
      const existingIndex = user.skills.findIndex(
        (s) => s.name.toLowerCase() === extracted.name.toLowerCase()
      );

      if (existingIndex >= 0) {
        user.skills[existingIndex].source = "resume";
        user.skills[existingIndex].isAiExtracted = true;
        user.skills[existingIndex].aiConfidence = 90;
        user.skills[existingIndex].level = extracted.level;
        user.skills[existingIndex].score = extracted.score;
        user.skills[existingIndex].category = extracted.category;
      } else {
        user.skills.push({
          _id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: extracted.name,
          category: extracted.category,
          level: extracted.level,
          score: extracted.score,
          source: "resume",
          isAiExtracted: true,
          aiConfidence: 90,
          confirmedByCandidate: false,
          createdAt: new Date()
        });
      }
    }

    await dataStore.updateUser(req.userId, { skills: user.skills });

    return res.json({
      success: true,
      skills: validatedSkills,
      totalFound: validatedSkills.length,
      aiMode,
      resumeAnalysis: buildResumeSummary(resumeText, resume.originalName, validatedSkills),
      message: aiMode === "gemini-ai"
        ? `Extracted ${validatedSkills.length} skills from resume using Gemini AI`
        : `Extracted ${validatedSkills.length} skills from resume using the built-in resume analyzer`
    });
  } catch (error) {
    next(error);
  }
}
