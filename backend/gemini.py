def generate_explanation(metrics):
    dp = metrics.get("demographic_parity", 0)
    di = metrics.get("disparate_impact", 1)

    if di < 0.8:
        return (
            f"The model shows bias. Disparate impact is {di}, "
            f"which is below the fairness threshold (0.8). "
            f"This indicates unequal selection rates between groups."
        )
    else:
        return (
            f"The model appears fair. Disparate impact is {di}, "
            f"which is within acceptable limits."
        )