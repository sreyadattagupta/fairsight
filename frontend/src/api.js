const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ── helpers ────────────────────────────────────────────────────────────────
const post    = (url, body)  => fetch(`${BASE_URL}${url}`, { method:"POST", body });
const postJSON= (url, data)  => fetch(`${BASE_URL}${url}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
const getJSON = (url)        => fetch(`${BASE_URL}${url}`);
const del     = (url)        => fetch(`${BASE_URL}${url}`, { method:"DELETE" });

const safeJSON = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    return { error: text || `HTTP ${res.status}` };
  }
  return res.json();
};

// ── COLUMNS preview ────────────────────────────────────────────────────────
export const getColumns = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  try {
    return await safeJSON(await post("/columns", fd));
  } catch {
    return { error: "Could not read file columns" };
  }
};

// ── AUDIT ──────────────────────────────────────────────────────────────────
export const auditDataset = async (file, target, sensitive) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("target_column", target);
  fd.append("sensitive_column", sensitive);
  try {
    return await safeJSON(await post("/audit", fd));
  } catch {
    return { error: "Audit request failed" };
  }
};

// ── REPORT ─────────────────────────────────────────────────────────────────
export const getReport = async (id) => {
  try {
    return await safeJSON(await getJSON(`/report/${id}`));
  } catch {
    return { error: "Report fetch failed" };
  }
};

// ── EXPLAIN ────────────────────────────────────────────────────────────────
export const getExplanation = async (id) => {
  try {
    return await safeJSON(await post(`/explain/${id}`, null));
  } catch {
    return { error: "Explanation request failed" };
  }
};

// ── FIX ────────────────────────────────────────────────────────────────────
export const getFixSuggestions = async (id) => {
  try {
    return await safeJSON(await post(`/fix/${id}`, null));
  } catch {
    return { error: "Fix request failed" };
  }
};

// ── HISTORY ────────────────────────────────────────────────────────────────
export const getHistory = async () => {
  try {
    return await safeJSON(await getJSON("/history"));
  } catch {
    return { error: "History fetch failed" };
  }
};

export const deleteAudit = async (id) => {
  try {
    return await safeJSON(await del(`/history/${id}`));
  } catch {
    return { error: "Delete failed" };
  }
};

// ── HEALTH ─────────────────────────────────────────────────────────────────
export const checkHealth = async () => {
  try {
    return await safeJSON(await getJSON("/health"));
  } catch {
    return { error: "Backend offline" };
  }
};