import pandas as pd

def compute_fairness_metrics(df, target_column, sensitive_column):
    """
    Computes:
    - Demographic Parity
    - Disparate Impact
    """

    groups = df[sensitive_column].unique()

    if len(groups) != 2:
        return {"error": "Only binary sensitive attribute supported"}

    g1, g2 = groups[0], groups[1]

    g1_df = df[df[sensitive_column] == g1]
    g2_df = df[df[sensitive_column] == g2]

    # probability of positive outcome
    p1 = g1_df[target_column].mean()
    p2 = g2_df[target_column].mean()

    demographic_parity = abs(p1 - p2)

    # Avoid divide by zero
    if p2 == 0:
        disparate_impact = 0
    else:
        disparate_impact = p1 / p2

    return {
        "group_1": str(g1),
        "group_2": str(g2),
        "p_group_1": round(p1, 3),
        "p_group_2": round(p2, 3),
        "demographic_parity": round(demographic_parity, 3),
        "disparate_impact": round(disparate_impact, 3)
    }