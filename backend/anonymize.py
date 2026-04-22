import pandas as pd
import re

# Columns that are likely PII - drop before sending to any external AI
PII_PATTERNS = [
    r"\bname\b", r"\bemail\b", r"\bphone\b", r"\baddress\b",
    r"\bssn\b", r"\bsocial.?security\b", r"\bpassport\b",
    r"\bip.?address\b", r"\bdob\b", r"\bdate.?of.?birth\b",
    r"\bcredit.?card\b", r"\bcard.?number\b",
]


def anonymize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Drops columns whose names match common PII patterns.
    Returns a copy of the DataFrame with PII columns removed.
    """
    df = df.copy()
    cols_to_drop = []

    for col in df.columns:
        for pattern in PII_PATTERNS:
            if re.search(pattern, col, re.IGNORECASE):
                cols_to_drop.append(col)
                break

    if cols_to_drop:
        df = df.drop(columns=cols_to_drop)

    return df