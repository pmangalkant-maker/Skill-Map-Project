import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSkills, addSkill, updateSkill, removeSkill } from "../controllers/skillController.js";

const router = Router();
router.use(authMiddleware);
router.get("/", getSkills);
router.post("/", addSkill);
router.put("/:skillId", updateSkill);
router.delete("/:skillId", removeSkill);
export default router;