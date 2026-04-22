from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import uuid
import datetime

from fairness import compute_fairness_metrics
from gemini import generate_explanation, generate_fix_suggestions
from anonymize import anonymize_dataframe

app = FastAPI(
    title="FairSight API",
    description="Detect and remediate bias in ML model predictions",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory store (replace with DB for production) ─────────────────────────
AUDIT_HISTORY: dict[str, dict] = {}


# ── Health ───────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "FairSight API running 🚀", "status": "ok"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}


# ── Column preview ───────────────────────────────────────────────────────────
@app.post("/columns", tags=["Dataset"])
async def get_columns(file: UploadFile = File(...)):
    """
    Upload a CSV and get back its column names + first 3 rows preview.
    Use this to populate the column dropdowns in the frontend.
    """
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        preview = df.head(3).fillna("").to_dict(orient="records")
        return {
            "columns": df.columns.tolist(),
            "preview": preview,
            "rows": len(df),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")


# ── Audit ────────────────────────────────────────────────────────────────────
@app.post("/audit", tags=["Audit"])
async def audit(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    sensitive_column: str = Form(...),
):
    """
    Upload a CSV dataset, specify which column is the outcome (target)
    and which column is the sensitive attribute.  Returns fairness metrics.
    """
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {str(e)}")

    if target_column not in df.columns:
        raise HTTPException(status_code=422, detail=f"Column '{target_column}' not found")
    if sensitive_column not in df.columns:
        raise HTTPException(status_code=422, detail=f"Column '{sensitive_column}' not found")

    # Anonymize before any external processing
    df_clean = anonymize_dataframe(df)

    metrics = compute_fairness_metrics(df_clean, target_column, sensitive_column)

    if "error" in metrics:
        raise HTTPException(status_code=422, detail=metrics["error"])

    audit_id = str(uuid.uuid4())
    AUDIT_HISTORY[audit_id] = {
        "audit_id": audit_id,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "filename": file.filename,
        "target_column": target_column,
        "sensitive_column": sensitive_column,
        "metrics": metrics,
    }

    return {
        "audit_id": audit_id,
        "timestamp": AUDIT_HISTORY[audit_id]["timestamp"],
        "metrics": metrics,
    }


# ── Report ────────────────────────────────────────────────────────────────────
@app.get("/report/{audit_id}", tags=["Audit"])
def report(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        raise HTTPException(status_code=404, detail="Audit not found")
    return AUDIT_HISTORY[audit_id]


# ── Explain (AI) ───────────────────────────────────────────────────────────
@app.post("/explain/{audit_id}", tags=["AI"])
def explain(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        raise HTTPException(status_code=404, detail="Audit not found")

    metrics = AUDIT_HISTORY[audit_id]["metrics"]
    explanation = generate_explanation(metrics)

    # Cache explanation
    AUDIT_HISTORY[audit_id]["explanation"] = explanation

    return {"audit_id": audit_id, "explanation": explanation}


# ── Fix Suggestions (AI) ──────────────────────────────────────────────────
@app.post("/fix/{audit_id}", tags=["AI"])
def fix(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        raise HTTPException(status_code=404, detail="Audit not found")

    metrics = AUDIT_HISTORY[audit_id]["metrics"]
    suggestions = generate_fix_suggestions(metrics)

    # Also include AI explanation for context
    explanation = generate_explanation(metrics)

    AUDIT_HISTORY[audit_id]["suggestions"] = suggestions

    return {
        "audit_id": audit_id,
        "suggestions": suggestions,
        "ai_notes": explanation,
        "severity": metrics.get("severity", "UNKNOWN"),
    }


# ── History ───────────────────────────────────────────────────────────────
@app.get("/history", tags=["History"])
def history():
    items = list(AUDIT_HISTORY.values())
    # Return newest first
    items.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return {
        "total": len(items),
        "data": {item["audit_id"]: item for item in items},
    }


@app.delete("/history/{audit_id}", tags=["History"])
def delete_audit(audit_id: str):
    if audit_id not in AUDIT_HISTORY:
        raise HTTPException(status_code=404, detail="Audit not found")
    del AUDIT_HISTORY[audit_id]
    return {"deleted": audit_id}