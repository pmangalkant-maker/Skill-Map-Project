import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dataStore } from "../services/dataStore.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing. Please define JWT_SECRET in your .env configuration.");
  }
  return secret;
}

function signToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "7d" });
}

function formatUserResponse(user) {
  return {
    id: (user._id || user.id).toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    headline: user.headline || "",
    bio: user.bio || "",
    education: user.education || "",
    degree: user.degree || "",
    department: user.department || "",
    graduationYear: user.graduationYear || "",
    experienceLevel: user.experienceLevel || "",
    targetRole: user.targetRole || "Full Stack Cloud Engineer",
    location: user.location || "",
    readinessScore: user.readinessScore || 78,
    careerInterests: user.careerInterests || [],
    skills: user.skills || [],
    skillsCount: user.skills ? user.skills.length : 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role === "industry" ? "recruiter" : user.role === "institution" ? "college_staff" : (user.role || "student"),
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone, targetRole, role } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await dataStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await dataStore.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone?.trim() || "",
      targetRole: targetRole?.trim() || "Full Stack Cloud Engineer",
      role: ["student", "recruiter", "college_staff", "academician", "industry", "institution"].includes(role) ? role : "student"
    });

    const token = signToken((user._id || user.id).toString());

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await dataStore.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const requestedRole = role || "student";
    const actualRole = user.role || "student";
    const roleMatches = requestedRole === actualRole ||
      (requestedRole === "recruiter" && actualRole === "industry") ||
      (requestedRole === "college_staff" && actualRole === "institution");
    if (!roleMatches) {
      const label = actualRole === "college_staff" || actualRole === "institution" ? "College Staff" : actualRole === "recruiter" || actualRole === "industry" ? "Recruiter" : actualRole.charAt(0).toUpperCase() + actualRole.slice(1);
      return res.status(403).json({ success: false, message: `This account is registered as ${label}. Select the correct role to continue.` });
    }

    const token = signToken((user._id || user.id).toString());

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found" });
    }
    res.json({
      success: true,
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
}
