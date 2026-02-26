import { Router, Request, Response } from "express";
import Submission from "../models/Submission";
import Form from "../models/Form";

const router = Router();

// Submit a form response
router.post("/", async (req: Request, res: Response) => {
  try {
    const { formId, data, mondayItemId } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    if (!form.isActive) return res.status(403).json({ success: false, message: "This form is no longer active" });

    const submission = new Submission({
      formId,
      boardId: form.boardId,
      data,
      mondayItemId,
      isUpdate: !!mondayItemId,
      ipAddress: req.ip,
    });

    await submission.save();
    await Form.findByIdAndUpdate(formId, { $inc: { submissionCount: 1 } });

    res.status(201).json({
      success: true,
      data: submission,
      message: form.settings.successMessage,
      redirectUrl: form.settings.redirectUrl,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit form" });
  }
});

// Get a submission by ID
router.get("/:submissionId", async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch submission" });
  }
});

export default router;
