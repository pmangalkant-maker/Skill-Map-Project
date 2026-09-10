import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getRoadmap, updateModule } from "../controllers/roadmapController.js";

const router = Router();
router.use(authMiddleware);
router.get("/", getRoadmap);
router.put("/modules/:moduleId", updateModule);
export default router;