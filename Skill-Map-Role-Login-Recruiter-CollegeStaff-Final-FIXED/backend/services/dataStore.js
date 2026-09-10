import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import Resume from "../models/Resume.js";

// In-Memory Storage for when MongoDB is disconnected or pending configuration
const inMemoryUsers = new Map();
const inMemoryResumes = new Map();
const inMemoryRoadmaps = new Map();
const inMemoryApplications = new Map();

// Initialize default candidate for seamless testing
async function initDefaultData() {
  const defaultHash = await bcrypt.hash("Password123!", 10);
  const defaultUser = {
    _id: "usr-4091",
    id: "usr-4091",
    name: "Alex Rivers",
    role: "student",
    email: "alex.rivers@example.com",
    passwordHash: defaultHash,
    phone: "+1 (555) 019-2834",
    headline: "Full-Stack Software Engineer & Cloud Systems Architect",
    bio: "Passionate early-career engineer specializing in TypeScript, React, and cloud application design. Committed to clean code, robust API architecture, and test-driven development.",
    education: "University Institute of Technology",
    degree: "B.S. in Computer Science & Systems Engineering",
    department: "Computer Science & Engineering",
    graduationYear: "2026",
    experienceLevel: "Entry Level / Associate (1-2 yrs)",
    targetRole: "Full Stack Cloud Engineer",
    location: "San Francisco Bay Area, CA",
    readinessScore: 78,
    careerInterests: ["Full-Stack Development", "Cloud Architecture", "Distributed Systems", "AI Tooling"],
    skills: [
      {
        _id: "sk-1",
        name: "TypeScript & Modern JavaScript",
        category: "Technical Skills",
        level: "Advanced",
        score: 88,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      },
      {
        _id: "sk-2",
        name: "React Ecosystem & Next.js",
        category: "Technical Skills",
        level: "Advanced",
        score: 84,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      },
      {
        _id: "sk-3",
        name: "Node.js & Express REST APIs",
        category: "Technical Skills",
        level: "Intermediate",
        score: 75,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      },
      {
        _id: "sk-4",
        name: "PostgreSQL & Relational Data Modeling",
        category: "Technical Skills",
        level: "Intermediate",
        score: 65,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      },
      {
        _id: "sk-5",
        name: "Cloud Infrastructure (GCP / AWS)",
        category: "Tools & Technologies",
        level: "Beginner",
        score: 45,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      },
      {
        _id: "sk-6",
        name: "Agile & Technical Collaboration",
        category: "Soft Skills",
        level: "Advanced",
        score: 90,
        source: "manual",
        isAiExtracted: false,
        confirmedByCandidate: true,
        createdAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  inMemoryUsers.set(defaultUser._id, defaultUser);
  inMemoryUsers.set(defaultUser.email.toLowerCase(), defaultUser);

  const recruiter = {
    _id: "usr-demo-recruiter", id: "usr-demo-recruiter", name: "Demo Recruiter", role: "recruiter",
    email: "recruiter@skillmap.demo", passwordHash: defaultHash, headline: "Talent Acquisition Partner",
    targetRole: "Talent Acquisition", readinessScore: 100, skills: [], careerInterests: [], createdAt: new Date(), updatedAt: new Date()
  };
  const collegeStaff = {
    _id: "usr-demo-college-staff", id: "usr-demo-college-staff", name: "Demo College Staff", role: "college_staff",
    email: "staff@skillmap.demo", passwordHash: defaultHash, headline: "Placement & Industry Relations",
    targetRole: "Institutional Placement Management", readinessScore: 100, skills: [], careerInterests: [], createdAt: new Date(), updatedAt: new Date()
  };
  inMemoryUsers.set(recruiter._id, recruiter); inMemoryUsers.set(recruiter.email, recruiter);
  inMemoryUsers.set(collegeStaff._id, collegeStaff); inMemoryUsers.set(collegeStaff.email, collegeStaff);
}

void initDefaultData();

export const dataStore = {
  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  },

  async findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (this.isMongoConnected()) {
      try {
        const dbUser = await User.findOne({ email: normalized }).select("+passwordHash");
        if (dbUser) return dbUser;
      } catch (err) {
        console.warn("MongoDB findUserByEmail fallback:", err.message);
      }
    }
    return inMemoryUsers.get(normalized) || null;
  },

  async findUserById(id) {
    const strId = id?.toString();
    if (this.isMongoConnected()) {
      try {
        const user = await User.findById(strId);
        if (user) return user;
      } catch (err) {
        console.warn("MongoDB findUserById fallback:", err.message);
      }
    }
    return inMemoryUsers.get(strId) || null;
  },

  async createUser(userData) {
    if (this.isMongoConnected()) {
      try {
        return await User.create(userData);
      } catch (err) {
        if (err.code === 11000) {
          throw err;
        }
        console.warn("MongoDB createUser fallback:", err.message);
      }
    }

    const newId = `usr-${Date.now()}`;
    const user = {
      ...userData,
      _id: newId,
      id: newId,
      skills: userData.skills || [],
      careerInterests: userData.careerInterests || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    inMemoryUsers.set(newId, user);
    inMemoryUsers.set(user.email.toLowerCase(), user);
    return user;
  },

  async updateUser(id, updates) {
    const strId = id?.toString();
    if (this.isMongoConnected()) {
      try {
        const updated = await User.findByIdAndUpdate(
          strId,
          { $set: updates },
          { new: true, runValidators: true }
        ).select("-passwordHash");
        if (updated) return updated;
      } catch (err) {
        console.warn("MongoDB updateUser fallback:", err.message);
      }
    }

    const user = inMemoryUsers.get(strId);
    if (!user) return null;

    Object.assign(user, updates, { updatedAt: new Date() });
    if (updates.email) {
      inMemoryUsers.set(updates.email.toLowerCase(), user);
    }
    return user;
  },

  async getResumeByUserId(userId) {
    const strId = userId?.toString();
    if (this.isMongoConnected()) {
      try {
        return await Resume.findOne({ userId: strId }).select("-extractedText");
      } catch (err) {
        console.warn("MongoDB getResume fallback:", err.message);
      }
    }
    return inMemoryResumes.get(strId) || null;
  },

  async saveResume(resumeData) {
    const strId = resumeData.userId?.toString();
    if (this.isMongoConnected()) {
      try {
        await Resume.deleteOne({ userId: strId });
        return await Resume.create(resumeData);
      } catch (err) {
        console.warn("MongoDB saveResume fallback:", err.message);
      }
    }

    const doc = {
      ...resumeData,
      _id: `res-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryResumes.set(strId, doc);
    return doc;
  },

  async deleteResume(userId) {
    const strId = userId?.toString();
    if (this.isMongoConnected()) {
      try {
        await Resume.deleteOne({ userId: strId });
      } catch (err) {
        console.warn("MongoDB deleteResume fallback:", err.message);
      }
    }
    inMemoryResumes.delete(strId);
  },

  getMemoryApplications(userId) {
    const key = userId?.toString();
    if (!inMemoryApplications.has(key)) inMemoryApplications.set(key, []);
    return inMemoryApplications.get(key);
  },

  getAllMemoryApplications() {
    return Array.from(inMemoryApplications.values()).flat();
  },

  async getRoadmap(userId) {
    const strId = userId?.toString();
    return inMemoryRoadmaps.get(strId) || null;
  },

  async saveRoadmap(userId, roadmapData) {
    const strId = userId?.toString();
    inMemoryRoadmaps.set(strId, roadmapData);
    return roadmapData;
  },

  async getStudentUsers() {
    if (this.isMongoConnected()) {
      try {
        const dbUsers = await User.find({ role: "student" }).select("-passwordHash").lean();
        if (dbUsers && dbUsers.length > 0) {
          return dbUsers;
        }
      } catch (err) {
        console.warn("MongoDB getStudentUsers fallback:", err.message);
      }
    }
    const students = [];
    const seen = new Set();
    for (const u of inMemoryUsers.values()) {
      const emailLower = (u.email || "").toLowerCase();
      if ((u.role === "student" || !u.role) && !seen.has(emailLower)) {
        seen.add(emailLower);
        students.push(u);
      }
    }
    return students;
  }
};
