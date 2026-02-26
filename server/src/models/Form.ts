import mongoose, { Schema, Document } from "mongoose";

export interface IFormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  logic?: {
    conditions: Array<{
      fieldId: string;
      operator: "equals" | "not_equals" | "contains" | "is_empty" | "is_not_empty";
      value: string;
    }>;
    action: "show" | "hide";
  };
  mondayColumnId?: string;
  mondayColumnType?: string;
}

export interface IForm extends Document {
  title: string;
  description: string;
  boardId: string;
  workspaceId: string;
  fields: IFormField[];
  settings: {
    allowUpdate: boolean;
    allowSubItems: boolean;
    prefillEnabled: boolean;
    customTheme?: {
      primaryColor: string;
      backgroundColor: string;
      fontFamily: string;
    };
    successMessage: string;
    redirectUrl?: string;
  };
  submissionCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  placeholder: String,
  options: [String],
  logic: {
    conditions: [
      {
        fieldId: String,
        operator: String,
        value: String,
      },
    ],
    action: String,
  },
  mondayColumnId: String,
  mondayColumnType: String,
});

const FormSchema = new Schema<IForm>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    boardId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    fields: [FormFieldSchema],
    settings: {
      allowUpdate: { type: Boolean, default: false },
      allowSubItems: { type: Boolean, default: false },
      prefillEnabled: { type: Boolean, default: false },
      customTheme: {
        primaryColor: { type: String, default: "#0073ea" },
        backgroundColor: { type: String, default: "#ffffff" },
        fontFamily: { type: String, default: "Roboto, sans-serif" },
      },
      successMessage: { type: String, default: "Thank you! Your response has been submitted." },
      redirectUrl: String,
    },
    submissionCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IForm>("Form", FormSchema);
