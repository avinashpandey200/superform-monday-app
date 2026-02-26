import { Router, Request, Response } from "express";
import { db } from "../store";

const router = Router();

// Submit a form response
router.post("/", (req: Request, res: Response) => {
  const { formId, data, mondayItemId } = req.body;

  const form = db.forms.findById(formId);
  if (!form) return res.status(404).json({ success: false, message: "Form not found" });
  if (!form.isActive) return res.status(403).json({ success: false, message: "This form is no longer active" });

  const submission = db.submissions.create({
    formId,
    boardId: form.boardId,
    data,
    mondayItemId,
    isUpdate: !!mondayItemId,
    ipAddress: req.ip,
  });

  db.forms.incrementSubmissionCount(formId);

  res.status(201).json({
    success: true,
    data: submission,
    message: form.settings.successMessage,
    redirectUrl: form.settings.redirectUrl,
  });
});

// Get a submission by ID
router.get("/:submissionId", (req: Request, res: Response) => {
  const submission = db.submissions.findById(String(req.params.submissionId));
  if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });
  res.json({ success: true, data: submission });
});

export default router;
