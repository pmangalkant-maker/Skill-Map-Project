import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { analyze } from "../controllers/matchingController.js";

const router = Router();
router.use(authMiddleware);
router.post("/analyze", analyze);
export default router;