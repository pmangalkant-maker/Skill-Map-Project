import { dataStore } from "../services/dataStore.js";

export function formatSkill(skill) {
  const skillId = (skill._id || skill.id || `sk-${Date.now()}`).toString();
  const rawSource = skill.source;
  const isResume = rawSource === "resume" || rawSource === "resume_extracted" || Boolean(skill.isAiExtracted);
  const normalizedSource = isResume ? "resume" : "manual";

  return {
    id: skillId,
    _id: skillId,
    name: skill.name,
    category: skill.category || "Technical Skills",
    level: skill.level || "Intermediate",
    score: typeof skill.score === "number" && !isNaN(skill.score)
      ? skill.score
      : (skill.level === "Advanced" ? 85 : skill.level === "Intermediate" ? 70 : 50),
    targetScore: typeof skill.targetScore === "number" && !isNaN(skill.targetScore) ? skill.targetScore : 85,
    status: skill.status || (skill.confirmedByCandidate ? "Verified" : "Self-Assessed"),
    source: normalizedSource,
    isAiExtracted: isResume,
    aiConfidence: skill.aiConfidence || (isResume ? 90 : undefined),
    confirmedByCandidate: skill.confirmedByCandidate !== false,
    notes: skill.notes || undefined,
    lastUpdated: skill.updatedAt ? new Date(skill.updatedAt).toLocaleDateString() : "Recently"
  };
}

export async function getSkills(req, res, next) {
  try {
    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const formatted = (user.skills || []).map(formatSkill);
    res.json({ success: true, skills: formatted });
  } catch (error) {
    next(error);
  }
}

export async function addSkill(req, res, next) {
  try {
    const { name, category, level, score, targetScore, source, notes, status } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.skills) user.skills = [];

    const cleanName = name.trim();
    // Requirement 4: Prevent duplicate skills for the same user
    const exists = user.skills.some((s) => s.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      return res.status(409).json({ success: false, message: "A skill with this name already exists in your inventory" });
    }

    const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const chosenLevel = validLevels.includes(level) ? level : "Intermediate";
    const chosenCategory = category && typeof category === "string" && category.trim() ? category.trim() : "Technical Skills";
    const chosenScore = typeof score === "number" && !isNaN(score)
      ? Math.max(0, Math.min(100, Math.round(score)))
      : (chosenLevel === "Expert" ? 95 : chosenLevel === "Advanced" ? 85 : chosenLevel === "Intermediate" ? 70 : 50);

    // Requirement 5 & 6: Resume skills use 'resume', manually added use 'manual'
    const chosenSource = source === "resume" || source === "resume_extracted" ? "resume" : "manual";
    const isAi = chosenSource === "resume";

    const newSkill = {
      _id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      category: chosenCategory,
      level: chosenLevel,
      score: chosenScore,
      targetScore: typeof targetScore === "number" && !isNaN(targetScore) ? targetScore : 85,
      source: chosenSource,
      isAiExtracted: isAi,
      aiConfidence: isAi ? 90 : undefined,
      confirmedByCandidate: !isAi,
      status: status || (isAi ? "Self-Assessed" : "Verified"),
      notes: notes && typeof notes === "string" ? notes.trim() : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.skills.push(newSkill);
    await dataStore.updateUser(req.userId, { skills: user.skills });

    res.status(201).json({
      success: true,
      message: "Skill successfully added to profile",
      skill: formatSkill(newSkill)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSkill(req, res, next) {
  try {
    const { skillId } = req.params;
    if (!skillId) {
      return res.status(400).json({ success: false, message: "Skill ID is required" });
    }

    const { name, category, level, score, targetScore, source, notes, status, confirmedByCandidate } = req.body;

    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const item = (user.skills || []).find(
      (s) => (s._id || s.id)?.toString() === skillId || s.name.toLowerCase() === skillId.toLowerCase()
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Skill not found in candidate inventory" });
    }

    // Prevent duplicate skill if renamed
    if (name !== undefined && typeof name === "string" && name.trim()) {
      const cleanName = name.trim();
      const duplicate = (user.skills || []).find(
        (s) => (s._id || s.id)?.toString() !== (item._id || item.id)?.toString() &&
               s.name.toLowerCase() === cleanName.toLowerCase()
      );
      if (duplicate) {
        return res.status(409).json({ success: false, message: "Another skill with this name already exists in your inventory" });
      }
      item.name = cleanName;
    }

    if (category !== undefined && typeof category === "string" && category.trim()) {
      item.category = category.trim();
    }
    if (level !== undefined && typeof level === "string") {
      const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
      if (validLevels.includes(level)) item.level = level;
    }
    if (score !== undefined && typeof score === "number" && !isNaN(score)) {
      item.score = Math.max(0, Math.min(100, Math.round(score)));
    }
    if (targetScore !== undefined && typeof targetScore === "number" && !isNaN(targetScore)) {
      item.targetScore = Math.max(0, Math.min(100, Math.round(targetScore)));
    }
    if (source !== undefined && typeof source === "string") {
      item.source = source === "resume" || source === "resume_extracted" ? "resume" : "manual";
      item.isAiExtracted = item.source === "resume";
    }
    if (confirmedByCandidate !== undefined) {
      item.confirmedByCandidate = Boolean(confirmedByCandidate);
      if (item.confirmedByCandidate && !status) {
        item.status = "Verified";
      }
    }
    if (status !== undefined && typeof status === "string") {
      item.status = status;
    }
    if (notes !== undefined) {
      item.notes = typeof notes === "string" ? notes.trim() : undefined;
    }
    item.updatedAt = new Date();

    await dataStore.updateUser(req.userId, { skills: user.skills });

    res.json({
      success: true,
      message: "Skill updated successfully",
      skill: formatSkill(item)
    });
  } catch (error) {
    next(error);
  }
}

export async function removeSkill(req, res, next) {
  try {
    const { skillId } = req.params;
    if (!skillId) {
      return res.status(400).json({ success: false, message: "Skill ID is required" });
    }

    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const initialLen = (user.skills || []).length;
    user.skills = (user.skills || []).filter(
      (s) => (s._id || s.id)?.toString() !== skillId && s.name.toLowerCase() !== skillId.toLowerCase()
    );

    if (user.skills.length === initialLen) {
      return res.status(404).json({ success: false, message: "Skill not found in candidate inventory" });
    }

    await dataStore.updateUser(req.userId, { skills: user.skills });

    res.json({
      success: true,
      message: "Skill successfully deleted from candidate profile"
    });
  } catch (error) {
    next(error);
  }
}
