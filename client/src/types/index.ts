export type ColumnType =
  | "text"
  | "long_text"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "dropdown"
  | "checkbox"
  | "rating"
  | "status"
  | "tags"
  | "people"
  | "hour"
  | "week"
  | "world_clock"
  | "formula"
  | "mirror"
  | "item_id"
  | "dependency";

export interface LogicCondition {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains" | "is_empty" | "is_not_empty";
  value: string;
}

export interface FieldLogic {
  conditions: LogicCondition[];
  action: "show" | "hide";
}

export interface FormField {
  id: string;
  type: ColumnType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  logic?: FieldLogic;
  mondayColumnId?: string;
  mondayColumnType?: string;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface FormSettings {
  allowUpdate: boolean;
  allowSubItems: boolean;
  prefillEnabled: boolean;
  customTheme?: FormTheme;
  successMessage: string;
  redirectUrl?: string;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  boardId: string;
  workspaceId: string;
  fields: FormField[];
  settings: FormSettings;
  submissionCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MondayColumn {
  id: string;
  title: string;
  type: string;
  settings_str?: string;
}

export interface MondayBoard {
  id: string;
  name: string;
  description?: string;
  columns: MondayColumn[];
}

export interface MondayItem {
  id: string;
  name: string;
  column_values: Array<{ id: string; text: string; value: string }>;
  subitems?: MondayItem[];
}

export interface Submission {
  _id: string;
  formId: string;
  boardId: string;
  data: Record<string, unknown>;
  mondayItemId?: string;
  isUpdate: boolean;
  submittedAt: string;
}
