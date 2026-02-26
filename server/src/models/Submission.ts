import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  formId: string;
  boardId: string;
  data: Record<string, unknown>;
  mondayItemId?: string;
  isUpdate: boolean;
  submittedAt: Date;
  ipAddress?: string;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    formId: { type: String, required: true, index: true },
    boardId: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    mondayItemId: String,
    isUpdate: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
