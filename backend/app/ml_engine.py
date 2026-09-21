import os
from io import BytesIO
from pathlib import Path

import joblib
import pandas as pd

try:
    from supabase import create_client
except ImportError:  # pragma: no cover - optional dependency at runtime
    create_client = None

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

storage = None
_model_cache = {}


def _download_model_bytes(bucket_name: str, object_name: str) -> bytes:
    if storage is not None:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(object_name)
        return blob.download_as_bytes()

    if create_client is None:
        raise RuntimeError("supabase package is not installed")

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv(
        "SUPABASE_ANON_KEY"
    )
    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured"
        )

    supabase = create_client(supabase_url, supabase_key)
    return supabase.storage.from_(bucket_name).download(object_name)


def _load_model_from_cloud(model_name: str):
    bucket_name = os.getenv("MODEL_BUCKET")
    object_name = os.getenv("MODEL_OBJECT") or f"models/{model_name}.pkl"

    if not bucket_name:
        raise RuntimeError("MODEL_BUCKET is not configured")

    model_bytes = _download_model_bytes(bucket_name, object_name)
    return joblib.load(BytesIO(model_bytes))


def _load_model_from_local(model_name: str):
    model_path = MODELS_DIR / f"{model_name}.pkl"

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    return joblib.load(model_path)


def load_model(model_name: str):
    if model_name not in _model_cache:
        source = os.getenv("MODEL_SOURCE", "local").lower()

        if source in {"supabase", "gcs"}:
            _model_cache[model_name] = _load_model_from_cloud(model_name)
        else:
            _model_cache[model_name] = _load_model_from_local(model_name)

    return _model_cache[model_name]


def prepare_features(features: dict):
    df = pd.DataFrame([features])

    df["Date"] = pd.to_datetime(df["Date"])
    is_weekend = df["Date"].dt.dayofweek >= 5
    df.insert(0, "Is_Weekend", is_weekend.astype(int))
    df = df.drop(columns=["Date"])

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
