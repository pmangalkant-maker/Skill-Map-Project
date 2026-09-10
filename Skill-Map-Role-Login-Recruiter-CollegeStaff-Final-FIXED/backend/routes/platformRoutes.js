import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { applyToOpportunity, listApplications, updateApplicationStatus, getPortfolio, updatePortfolio, listCollaborations, createCollaboration, institutionAnalytics } from "../controllers/platformController.js";

const router = Router();
router.use(authMiddleware);
router.get("/applications", listApplications);
router.post("/applications", applyToOpportunity);
router.patch("/applications/:id", updateApplicationStatus);
router.get("/portfolio", getPortfolio);
router.put("/portfolio", updatePortfolio);
router.get("/collaborations", listCollaborations);
router.post("/collaborations", createCollaboration);
router.get("/analytics", institutionAnalytics);
export default router;
