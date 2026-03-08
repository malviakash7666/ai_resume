import { Resume } from "../../database/models/index.js";

export const uploadResume = async (req, res) => {

  try {

    const userId = req.user?.id || "test-user-id"; 

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file required"
      });
    }

    const resume = await Resume.create({

      userId,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size

    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      data: resume
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Upload failed"
    });

  }

};
// fetch all uploaded resumes for logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user?.id || "test-user-id";

    const resumes = await Resume.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: resumes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};