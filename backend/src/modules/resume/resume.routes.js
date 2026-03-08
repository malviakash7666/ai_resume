import express from "express";
import { uploadResume } from "./upload.middleware.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { getUserResumes, uploadResume as uploadResumeController } from "./resume.controller.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  uploadResume.single("resume"),
  uploadResumeController
);
router.get("/",verifyToken, getUserResumes);
export default router;