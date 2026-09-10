import { dataStore } from "../services/dataStore.js";

function formatUserProfile(user) {
  return {
    id: (user._id || user.id).toString(),
    name: user.name || "",
    email: user.email || "",
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
  };
}

export async function getProfile(req, res, next) {
  try {
    const user = await dataStore.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    res.json({ success: true, user: formatUserProfile(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = [
      "name",
      "headline",
      "email",
      "phone",
      "education",
      "degree",
      "department",
      "graduationYear",
      "experienceLevel",
      "targetRole",
      "location",
      "bio",
      "careerInterests",
      "readinessScore"
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.email) {
      const normalizedEmail = updates.email.trim().toLowerCase();
      const existing = await dataStore.findUserByEmail(normalizedEmail);
      if (existing && (existing._id || existing.id).toString() !== req.userId.toString()) {
        return res.status(409).json({
          success: false,
          message: "Another account is already using this email address"
        });
      }
      updates.email = normalizedEmail;
    }

    const user = await dataStore.updateUser(req.userId, updates);

    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    res.json({
      success: true,
      message: "Candidate profile successfully updated",
      user: formatUserProfile(user)
    });
  } catch (error) {
    next(error);
  }
}
