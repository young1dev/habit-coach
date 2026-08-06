from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
print(Path(__file__).resolve())
MODELS_DIR = BASE_DIR / "models"

_model_cache = {}

def load_model(model_name: str):
    if model_name not in _model_cache:
        model_path = MODELS_DIR / f"{model_name}.pkl"
        _model_cache[model_name] = joblib.load(model_path)

    return _model_cache[model_name]

def prepare_features(features: dict):
    df = pd.DataFrame([features])

    df["Date"] = pd.to_datetime(df["Date"])

    df["Is_Weekend"] = (
        df["Date"]
        .dt.dayofweek
        .apply(lambda x: 1 if x >= 5 else 0)
    )

    df.drop(columns=["Date"], inplace=True)

    return df

def predict(features: dict, model_name: str = "default"):

    model = load_model(model_name)

    X = prepare_features(features)
    THRESHOLD = 0.65
    probability = model.predict_proba(X)[0][1]
    prediction = int(probability >= THRESHOLD)
    return {
        "probability": probability,
        "prediction": prediction,
    }

