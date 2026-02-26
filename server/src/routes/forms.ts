import { Router, Request, Response } from "express";
import Form from "../models/Form";
import Submission from "../models/Submission";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Get all forms for a board
router.get("/board/:boardId", async (req: Request, res: Response) => {
  try {
    const forms = await Form.find({ boardId: req.params.boardId });
    res.json({ success: true, data: forms });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch forms" });
  }
});

// Get single form by ID
router.get("/:formId", async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    res.json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch form" });
  }
});

// Create a new form
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, boardId, workspaceId, fields, settings } = req.body;
    const form = new Form({
      title,
      description,
      boardId,
      workspaceId,
      fields: (fields || []).map((f: Record<string, unknown>) => ({ ...f, id: f.id || uuidv4() })),
      settings,
    });
    await form.save();
    res.status(201).json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create form" });
  }
});

// Update a form
router.put("/:formId", async (req: Request, res: Response) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.formId, req.body, { new: true });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    res.json({ success: true, data: form });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update form" });
  }
});

// Delete a form
router.delete("/:formId", async (req: Request, res: Response) => {
  try {
    await Form.findByIdAndDelete(req.params.formId);
    res.json({ success: true, message: "Form deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete form" });
  }
});

// Get submissions for a form
router.get("/:formId/submissions", async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ formId: req.params.formId }).sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
});

export default router;
