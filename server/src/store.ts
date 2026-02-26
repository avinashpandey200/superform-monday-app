import { v4 as uuidv4 } from "uuid";

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

export interface IFormSettings {
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
}

export interface IForm {
  _id: string;
  title: string;
  description: string;
  boardId: string;
  workspaceId: string;
  fields: IFormField[];
  settings: IFormSettings;
  submissionCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISubmission {
  _id: string;
  formId: string;
  boardId: string;
  data: Record<string, unknown>;
  mondayItemId?: string;
  isUpdate: boolean;
  submittedAt: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Hardcoded seed forms ──────────────────────────────────────────────────────
const SEED_FORMS: IForm[] = [
  {
    _id: "form-001",
    title: "Customer Feedback Form",
    description: "Collect feedback from customers about their experience.",
    boardId: "demo",
    workspaceId: "demo",
    fields: [
      {
        id: "field-1",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        id: "field-2",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "you@example.com",
      },
      {
        id: "field-3",
        type: "dropdown",
        label: "How satisfied are you?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
      },
      {
        id: "field-4",
        type: "long_text",
        label: "Additional Comments",
        required: false,
        placeholder: "Tell us more...",
      },
    ],
    settings: {
      allowUpdate: false,
      allowSubItems: false,
      prefillEnabled: false,
      customTheme: {
        primaryColor: "#0073ea",
        backgroundColor: "#f0f4ff",
        fontFamily: "Roboto, sans-serif",
      },
      successMessage: "Thank you for your feedback! We appreciate it.",
    },
    submissionCount: 3,
    isActive: true,
    createdAt: new Date("2025-01-10T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-10T10:00:00Z").toISOString(),
  },
  {
    _id: "form-002",
    title: "Bug Report Form",
    description: "Report bugs and issues with the product.",
    boardId: "demo",
    workspaceId: "demo",
    fields: [
      {
        id: "field-1",
        type: "text",
        label: "Bug Title",
        required: true,
        placeholder: "Short description of the bug",
      },
      {
        id: "field-2",
        type: "dropdown",
        label: "Severity",
        required: true,
        options: ["Critical", "High", "Medium", "Low"],
      },
      {
        id: "field-3",
        type: "long_text",
        label: "Steps to Reproduce",
        required: true,
        placeholder: "1. Go to...\n2. Click on...",
      },
      {
        id: "field-4",
        type: "text",
        label: "Expected Behavior",
        required: false,
        placeholder: "What should have happened?",
      },
    ],
    settings: {
      allowUpdate: true,
      allowSubItems: false,
      prefillEnabled: false,
      customTheme: {
        primaryColor: "#e2445c",
        backgroundColor: "#fff5f5",
        fontFamily: "Roboto, sans-serif",
      },
      successMessage: "Bug reported! Our team will look into it.",
    },
    submissionCount: 1,
    isActive: true,
    createdAt: new Date("2025-01-15T09:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-15T09:00:00Z").toISOString(),
  },
  {
    _id: "form-003",
    title: "New Employee Onboarding",
    description: "Collect information for new employee setup.",
    boardId: "demo",
    workspaceId: "demo",
    fields: [
      {
        id: "field-1",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "First and last name",
      },
      {
        id: "field-2",
        type: "email",
        label: "Work Email",
        required: true,
        placeholder: "name@company.com",
      },
      {
        id: "field-3",
        type: "text",
        label: "Department",
        required: true,
        placeholder: "e.g. Engineering",
      },
      {
        id: "field-4",
        type: "date",
        label: "Start Date",
        required: true,
      },
      {
        id: "field-5",
        type: "phone",
        label: "Phone Number",
        required: false,
        placeholder: "+1 (555) 000-0000",
      },
    ],
    settings: {
      allowUpdate: false,
      allowSubItems: true,
      prefillEnabled: true,
      customTheme: {
        primaryColor: "#00c875",
        backgroundColor: "#f0fff8",
        fontFamily: "Roboto, sans-serif",
      },
      successMessage: "Welcome aboard! Your information has been received.",
    },
    submissionCount: 0,
    isActive: true,
    createdAt: new Date("2025-02-01T08:00:00Z").toISOString(),
    updatedAt: new Date("2025-02-01T08:00:00Z").toISOString(),
  },
];

// ── Hardcoded seed submissions ────────────────────────────────────────────────
const SEED_SUBMISSIONS: ISubmission[] = [
  {
    _id: "sub-001",
    formId: "form-001",
    boardId: "demo",
    data: {
      "field-1": "Alice Johnson",
      "field-2": "alice@example.com",
      "field-3": "Very Satisfied",
      "field-4": "Great product, really love the UI!",
    },
    isUpdate: false,
    submittedAt: new Date("2025-01-11T14:23:00Z").toISOString(),
    createdAt: new Date("2025-01-11T14:23:00Z").toISOString(),
    updatedAt: new Date("2025-01-11T14:23:00Z").toISOString(),
  },
  {
    _id: "sub-002",
    formId: "form-001",
    boardId: "demo",
    data: {
      "field-1": "Bob Smith",
      "field-2": "bob@example.com",
      "field-3": "Satisfied",
      "field-4": "Works well, but could use some speed improvements.",
    },
    isUpdate: false,
    submittedAt: new Date("2025-01-12T09:10:00Z").toISOString(),
    createdAt: new Date("2025-01-12T09:10:00Z").toISOString(),
    updatedAt: new Date("2025-01-12T09:10:00Z").toISOString(),
  },
  {
    _id: "sub-003",
    formId: "form-001",
    boardId: "demo",
    data: {
      "field-1": "Carol White",
      "field-2": "carol@example.com",
      "field-3": "Neutral",
      "field-4": "",
    },
    isUpdate: false,
    submittedAt: new Date("2025-01-13T16:45:00Z").toISOString(),
    createdAt: new Date("2025-01-13T16:45:00Z").toISOString(),
    updatedAt: new Date("2025-01-13T16:45:00Z").toISOString(),
  },
  {
    _id: "sub-004",
    formId: "form-002",
    boardId: "demo",
    data: {
      "field-1": "Login button not working on Safari",
      "field-2": "High",
      "field-3": "1. Open Safari\n2. Navigate to login page\n3. Click 'Sign In'",
      "field-4": "User should be logged in successfully",
    },
    isUpdate: false,
    submittedAt: new Date("2025-01-16T11:00:00Z").toISOString(),
    createdAt: new Date("2025-01-16T11:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-16T11:00:00Z").toISOString(),
  },
];

// ── In-memory store ───────────────────────────────────────────────────────────
const forms: IForm[] = [...SEED_FORMS];
const submissions: ISubmission[] = [...SEED_SUBMISSIONS];

// ── Form helpers ──────────────────────────────────────────────────────────────
export const db = {
  forms: {
    findByBoardId: (boardId: string): IForm[] =>
      forms.filter((f) => f.boardId === boardId),

    findById: (id: string): IForm | undefined =>
      forms.find((f) => f._id === id),

    create: (data: Omit<IForm, "_id" | "createdAt" | "updatedAt" | "submissionCount">): IForm => {
      const now = new Date().toISOString();
      const form: IForm = {
        ...data,
        _id: uuidv4(),
        submissionCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      forms.push(form);
      return form;
    },

    update: (id: string, data: Partial<IForm>): IForm | undefined => {
      const idx = forms.findIndex((f) => f._id === id);
      if (idx === -1) return undefined;
      forms[idx] = { ...forms[idx], ...data, _id: id, updatedAt: new Date().toISOString() };
      return forms[idx];
    },

    delete: (id: string): boolean => {
      const idx = forms.findIndex((f) => f._id === id);
      if (idx === -1) return false;
      forms.splice(idx, 1);
      return true;
    },

    incrementSubmissionCount: (id: string): void => {
      const form = forms.find((f) => f._id === id);
      if (form) form.submissionCount += 1;
    },
  },

  submissions: {
    findByFormId: (formId: string): ISubmission[] =>
      submissions
        .filter((s) => s.formId === formId)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),

    findById: (id: string): ISubmission | undefined =>
      submissions.find((s) => s._id === id),

    create: (data: Omit<ISubmission, "_id" | "submittedAt" | "createdAt" | "updatedAt">): ISubmission => {
      const now = new Date().toISOString();
      const submission: ISubmission = {
        ...data,
        _id: uuidv4(),
        submittedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      submissions.push(submission);
      return submission;
    },
  },
};
