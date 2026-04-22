import pandas as pd
import numpy as np


def compute_fairness_metrics(df: pd.DataFrame, target_column: str, sensitive_column: str) -> dict:
    """
    Computes comprehensive fairness metrics:
    - Demographic Parity (per group positive-outcome rates)
    - Disparate Impact (min-rate / max-rate, 4/5ths rule)
    - Max Parity Gap (max spread between any two groups)
    - Per-group counts and probabilities
    - Overall bias severity label
    """

    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found"}
    if sensitive_column not in df.columns:
        return {"error": f"Sensitive column '{sensitive_column}' not found"}

    # Coerce target to numeric (0/1)
    df = df.copy()
    df[target_column] = pd.to_numeric(df[target_column], errors="coerce")
    df = df.dropna(subset=[target_column, sensitive_column])
    df[target_column] = df[target_column].astype(int)

    groups = df[sensitive_column].unique().tolist()

    group_stats = {}
    rates = []

    for g in groups:
        g_df = df[df[sensitive_column] == g]
        count = len(g_df)
        positive_count = int(g_df[target_column].sum())
        rate = round(float(g_df[target_column].mean()), 4)
        group_stats[str(g)] = {
            "count": count,
            "positive_count": positive_count,
            "positive_rate": rate,
        }
        rates.append(rate)

    # Disparate Impact: min / max (higher is more fair, 0.8 is threshold)
    max_rate = max(rates) if rates else 1
    min_rate = min(rates) if rates else 0
    disparate_impact = round(min_rate / max_rate, 4) if max_rate > 0 else 0.0

    # Demographic Parity Gap: max - min
    demographic_parity_gap = round(max_rate - min_rate, 4)

    # Overall bias severity
    if disparate_impact < 0.6:
        severity = "CRITICAL"
    elif disparate_impact < 0.8:
        severity = "HIGH"
    elif disparate_impact < 0.9:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    # Convenience fields for 2-group backward compat
    g_keys = list(group_stats.keys())
    result = {
        "groups": g_keys,
        "group_stats": group_stats,
        "demographic_parity_gap": demographic_parity_gap,
        "disparate_impact": disparate_impact,
        "severity": severity,
        "total_rows": len(df),
        "target_column": target_column,
        "sensitive_column": sensitive_column,
    }

    # Legacy fields for 2-group usage
    if len(g_keys) >= 2:
        result["group_1"] = g_keys[0]
        result["group_2"] = g_keys[1]
        result["p_group_1"] = group_stats[g_keys[0]]["positive_rate"]
        result["p_group_2"] = group_stats[g_keys[1]]["positive_rate"]
        result["demographic_parity"] = demographic_parity_gap

    return result