import axios from "axios";
import { Form, MondayBoard, MondayColumn, MondayItem, Submission } from "../types";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("monday_token");
  if (token) config.headers.Authorization = token;
  return config;
});

// Forms
export const getForms = (boardId: string) =>
  api.get<{ success: boolean; data: Form[] }>(`/forms/board/${boardId}`).then((r) => r.data.data);

export const getForm = (formId: string) =>
  api.get<{ success: boolean; data: Form }>(`/forms/${formId}`).then((r) => r.data.data);

export const createForm = (form: Partial<Form>) =>
  api.post<{ success: boolean; data: Form }>("/forms", form).then((r) => r.data.data);

export const updateForm = (formId: string, form: Partial<Form>) =>
  api.put<{ success: boolean; data: Form }>(`/forms/${formId}`, form).then((r) => r.data.data);

export const deleteForm = (formId: string) =>
  api.delete(`/forms/${formId}`).then((r) => r.data);

export const getSubmissions = (formId: string) =>
  api.get<{ success: boolean; data: Submission[] }>(`/forms/${formId}/submissions`).then((r) => r.data.data);

// Submissions
export const submitForm = (formId: string, data: Record<string, unknown>, mondayItemId?: string) =>
  api
    .post<{ success: boolean; data: Submission; message: string; redirectUrl?: string }>("/submissions", {
      formId,
      data,
      mondayItemId,
    })
    .then((r) => r.data);

// Monday.com
export const getBoards = () =>
  api.get<{ success: boolean; data: MondayBoard[] }>("/monday/boards").then((r) => r.data.data);

export const getBoardColumns = (boardId: string) =>
  api.get<{ success: boolean; data: MondayColumn[] }>(`/monday/boards/${boardId}/columns`).then((r) => r.data.data);

export const getBoardItems = (boardId: string) =>
  api.get<{ success: boolean; data: MondayItem[] }>(`/monday/boards/${boardId}/items`).then((r) => r.data.data);

export const createMondayItem = (
  boardId: string,
  itemName: string,
  columnValues: Record<string, unknown>,
  groupId?: string
) =>
  api
    .post(`/monday/boards/${boardId}/items`, { itemName, columnValues, groupId })
    .then((r) => r.data.data);

export const updateMondayItem = (
  boardId: string,
  itemId: string,
  columnValues: Record<string, unknown>
) =>
  api
    .put(`/monday/boards/${boardId}/items/${itemId}`, { columnValues })
    .then((r) => r.data.data);
