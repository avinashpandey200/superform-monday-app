import { Router, Request, Response } from "express";
import { db, IFormField } from "../store";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Get all forms for a board
router.get("/board/:boardId", (req: Request, res: Response) => {
  const forms = db.forms.findByBoardId(String(req.params.boardId));
  res.json({ success: true, data: forms });
});

// Get single form by ID
router.get("/:formId", (req: Request, res: Response) => {
  const form = db.forms.findById(String(req.params.formId));
  if (!form) return res.status(404).json({ success: false, message: "Form not found" });
  res.json({ success: true, data: form });
});

// Create a new form
router.post("/", (req: Request, res: Response) => {
  const { title, description, boardId, workspaceId, fields, settings } = req.body;
  const form = db.forms.create({
    title,
    description: description || "",
    boardId,
    workspaceId,
    fields: (fields || []).map((f: IFormField) => ({ ...f, id: f.id || uuidv4() })),
    settings,
    isActive: true,
  });
  res.status(201).json({ success: true, data: form });
});

// Update a form
router.put("/:formId", (req: Request, res: Response) => {
  const form = db.forms.update(String(req.params.formId), req.body);
  if (!form) return res.status(404).json({ success: false, message: "Form not found" });
  res.json({ success: true, data: form });
});

// Delete a form
router.delete("/:formId", (req: Request, res: Response) => {
  const deleted = db.forms.delete(String(req.params.formId));
  if (!deleted) return res.status(404).json({ success: false, message: "Form not found" });
  res.json({ success: true, message: "Form deleted" });
});

// Get submissions for a form
router.get("/:formId/submissions", (req: Request, res: Response) => {
  const submissions = db.submissions.findByFormId(String(req.params.formId));
  res.json({ success: true, data: submissions });
});

export default router;
