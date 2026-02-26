import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useParams, useSearchParams, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import FormRenderer from "./components/FormRenderer/FormRenderer";
import Submissions from "./components/Dashboard/Submissions";
import { Form } from "./types";
import { createForm, getForm, updateForm } from "./api";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_FORM: Form = {
  title: "Untitled Form",
  description: "",
  boardId: "",
  workspaceId: "",
  fields: [],
  settings: {
    allowUpdate: false,
    allowSubItems: false,
    prefillEnabled: false,
    customTheme: { primaryColor: "#0073ea", backgroundColor: "#f0f4ff", fontFamily: "Roboto, sans-serif" },
    successMessage: "Thank you! Your response has been submitted.",
  },
  submissionCount: 0,
  isActive: true,
};

const BuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId?: string }>();
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "";
  const [form, setForm] = useState<Form>({ ...DEFAULT_FORM, boardId, workspaceId: boardId });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!formId);

  useEffect(() => {
    if (formId) {
      getForm(formId).then((f) => { setForm(f); setLoaded(true); });
    }
  }, [formId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form._id) {
        await updateForm(form._id, form);
      } else {
        const saved = await createForm(form);
        setForm(saved);
      }
      alert("Form saved successfully!");
    } catch {
      alert("Failed to save form.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div style={loadingStyle}>Loading form...</div>;

  return <FormBuilder form={form} onChange={setForm} onSave={handleSave} saving={saving} />;
};

const FormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<Form | null>(null);

  const prefillData: Record<string, string> = {};
  searchParams.forEach((val, key) => { if (key !== "itemId") prefillData[key] = val; });
  const existingItemId = searchParams.get("itemId") || undefined;

  useEffect(() => {
    if (formId) getForm(formId).then(setForm);
  }, [formId]);

  if (!form) return <div style={loadingStyle}>Loading form...</div>;

  return <FormRenderer form={form} prefillData={prefillData} existingItemId={existingItemId} />;
};

const SubmissionsPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  if (!formId) return <Navigate to="/" />;
  return <Submissions formId={formId} />;
};

const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId") || "demo";
  return (
    <div>
      <nav style={navStyle}>
        <span style={navLogo}>⚡ SuperForm</span>
      </nav>
      <Dashboard boardId={boardId} />
    </div>
  );
};

const loadingStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  height: "100vh", fontSize: 16, color: "#888", fontFamily: "Roboto, sans-serif",
};

const navStyle: React.CSSProperties = {
  height: 56,
  background: "#fff",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  alignItems: "center",
  padding: "0 24px",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const navLogo: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0073ea",
  letterSpacing: "-0.5px",
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/builder/:formId" element={<BuilderPage />} />
      <Route path="/form/:formId" element={<FormPage />} />
      <Route path="/submissions/:formId" element={<SubmissionsPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
