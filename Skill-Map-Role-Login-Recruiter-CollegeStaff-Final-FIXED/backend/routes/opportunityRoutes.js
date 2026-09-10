import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { listOpportunities, createOpportunity, listCandidates } from "../controllers/opportunityController.js";

const router = Router();
router.use(authMiddleware);
router.get("/", listOpportunities);
router.post("/", createOpportunity);
router.get("/candidates", listCandidates);
export default router;