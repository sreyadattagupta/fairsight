const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ------------------ AUDIT ------------------
export const auditDataset = async (file, target, sensitive) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_column", target);
  formData.append("sensitive_column", sensitive);

  try {
    const res = await fetch(`${BASE_URL}/audit`, {
      method: "POST",
      body: formData,
    });

    return await res.json();
  } catch (err) {
    return { error: "Audit failed" };
  }
};


// ------------------ REPORT ------------------
export const getReport = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/report/${id}`);
    return await res.json();
  } catch {
    return { error: "Report fetch failed" };
  }
};


// ------------------ EXPLANATION ------------------
export const getExplanation = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/explain/${id}`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return { error: "Explanation failed" };
  }
};


// ------------------ FIX ------------------
export const getFixSuggestions = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/fix/${id}`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return { error: "Fix failed" };
  }
};


// ------------------ HISTORY ------------------
export const getHistory = async () => {
  try {
    const res = await fetch(`${BASE_URL}/history`);
    return await res.json();
  } catch {
    return { error: "History failed" };
  }
};