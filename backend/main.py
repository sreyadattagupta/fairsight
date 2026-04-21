from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import uuid

from fairness import compute_fairness_metrics
from gemini import generate_explanation
from anonymize import anonymize_dataframe

app = FastAPI()

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUDIT_HISTORY = {}

@app.get("/")
def root():
    return {"message": "FairSight API running 🚀"}


# ------------------ AUDIT ------------------
@app.post("/audit")
async def audit(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    sensitive_column: str = Form(...)
):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    if target_column not in df.columns or sensitive_column not in df.columns:
        return {"error": "Invalid column names"}

    metrics = compute_fairness_metrics(df, target_column, sensitive_column)

    audit_id = str(uuid.uuid4())
    AUDIT_HISTORY[audit_id] = {
        "metrics": metrics
    }

    return {
        "audit_id": audit_id,
        "metrics": metrics
    }


# ------------------ REPORT ------------------
@app.get("/report/{audit_id}")
def report(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        return {"error": "Not found"}
    return AUDIT_HISTORY[audit_id]


# ------------------ EXPLAIN ------------------
@app.post("/explain/{audit_id}")
def explain(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        return {"error": "Not found"}

    metrics = AUDIT_HISTORY[audit_id]["metrics"]

    explanation = generate_explanation(metrics)

    return {"explanation": explanation}


# ------------------ FIX ------------------
@app.post("/fix/{audit_id}")
def fix(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        return {"error": "Not found"}

    metrics = AUDIT_HISTORY[audit_id]["metrics"]
    di = metrics["disparate_impact"]

    suggestions = []

    if di < 0.8:
        suggestions.append("Apply reweighing to balance groups")
        suggestions.append("Remove or reduce sensitive feature influence")
        suggestions.append("Adjust decision threshold")

    ai_text = generate_explanation(metrics)

    return {
        "suggestions": suggestions,
        "ai_notes": ai_text
    }


# ------------------ HISTORY ------------------
@app.get("/history")
def history():
    return {
        "total": len(AUDIT_HISTORY),
        "data": AUDIT_HISTORY
    }