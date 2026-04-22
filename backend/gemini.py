import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Try real Gemini; fall back to deterministic template if no key
try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        _model = genai.GenerativeModel("gemini-1.5-flash")
    else:
        _model = None
except ImportError:
    _model = None


def _build_prompt(metrics: dict, mode: str = "explain") -> str:
    di = metrics.get("disparate_impact", 1)
    gap = metrics.get("demographic_parity_gap", 0)
    severity = metrics.get("severity", "UNKNOWN")
    groups = metrics.get("groups", [])
    stats = metrics.get("group_stats", {})
    target = metrics.get("target_column", "outcome")
    sensitive = metrics.get("sensitive_column", "group")

    stats_text = ""
    for g, s in stats.items():
        stats_text += f"  - {g}: positive_rate={s['positive_rate']}, count={s['count']}\n"

    if mode == "explain":
        return f"""You are a fairness expert analyzing ML model bias for a tool called FairSight.

Dataset Analysis:
- Target column: {target}
- Sensitive attribute: {sensitive}
- Disparate Impact: {di} (threshold: 0.8 — below means biased)
- Demographic Parity Gap: {gap}
- Bias Severity: {severity}
- Groups found: {', '.join(str(g) for g in groups)}
- Per-group statistics:
{stats_text}

Write a clear, concise 2-paragraph explanation of:
1. What bias problem exists (or doesn't exist), and which group is disadvantaged
2. Why this matters in the real world (hiring, lending, healthcare, etc.)

Use plain English. Be direct and actionable. Avoid jargon."""

    else:  # fix mode
        return f"""You are a fairness engineer at a top AI safety lab.

Bias Report:
- Target: {target}, Sensitive: {sensitive}
- Disparate Impact: {di} (threshold: 0.8)
- Gap: {gap}, Severity: {severity}

Give exactly 5 numbered, specific technical recommendations to fix this bias.
Each recommendation should be a single sentence, starting with a strong action verb.
Format: numbered list only, no extra text."""


def generate_explanation(metrics: dict) -> str:
    """Generate a plain-English explanation of the detected bias."""
    if _model:
        try:
            prompt = _build_prompt(metrics, mode="explain")
            response = _model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            pass  # fall through to template

    # ── Deterministic fallback ──
    di = metrics.get("disparate_impact", 1)
    gap = metrics.get("demographic_parity_gap", 0)
    severity = metrics.get("severity", "LOW")
    groups = metrics.get("groups", [])
    stats = metrics.get("group_stats", {})
    target = metrics.get("target_column", "outcome")
    sensitive = metrics.get("sensitive_column", "group")

    # Find most disadvantaged group
    min_group = min(stats, key=lambda g: stats[g]["positive_rate"]) if stats else "minority group"
    max_group = max(stats, key=lambda g: stats[g]["positive_rate"]) if stats else "majority group"

    if di >= 0.9:
        return (
            f"✅ The model appears largely fair. Disparate impact is {di} (threshold ≥ 0.8), "
            f"and the demographic parity gap across {sensitive} groups is only {gap}. "
            f"The positive outcome rate for '{target}' is similar across all groups.\n\n"
            f"Continue monitoring this model over time as data distributions can shift."
        )
    elif di >= 0.8:
        return (
            f"⚠️ Mild bias detected. Disparate impact is {di} — just above the 0.8 threshold. "
            f"The group '{min_group}' receives the outcome '{target}' at a lower rate than '{max_group}' "
            f"(gap = {gap}). This may reflect historical patterns in training data.\n\n"
            f"Consider reviewing the feature engineering pipeline and testing with reweighing techniques."
        )
    else:
        return (
            f"🚨 Significant bias detected (severity: {severity}). Disparate impact is {di}, "
            f"far below the 0.8 fairness threshold. The group '{min_group}' is heavily "
            f"disadvantaged compared to '{max_group}' for the outcome '{target}' "
            f"(gap = {gap}). This constitutes a potential legal and ethical risk.\n\n"
            f"Immediate remediation is recommended: apply reweighing, resample the training data, "
            f"or adjust the decision threshold per group before deploying this model."
        )


def generate_fix_suggestions(metrics: dict) -> list[str]:
    """Return a list of fix recommendations."""
    if _model:
        try:
            prompt = _build_prompt(metrics, mode="fix")
            response = _model.generate_content(prompt)
            lines = [
                l.strip().lstrip("0123456789. )")
                for l in response.text.strip().split("\n")
                if l.strip()
            ]
            return lines[:6]
        except Exception:
            pass

    # ── Deterministic fallback ──
    di = metrics.get("disparate_impact", 1)
    suggestions = [
        "Apply reweighing: assign higher sample weights to the under-represented group during training.",
        "Audit the training data for historical bias and resample to achieve demographic balance.",
        "Use post-processing threshold adjustment — lower the decision threshold for the disadvantaged group.",
        "Remove or transform proxy features that encode sensitive attributes (e.g., zip code → income).",
        "Implement an adversarial debiasing layer in the model to decorrelate predictions from the sensitive attribute.",
    ]
    if di < 0.6:
        suggestions.append(
            "Consider scrapping and rebuilding the model with a fairness-aware objective function "
            "(e.g., Fairlearn, AI Fairness 360)."
        )
    return suggestions