import os
import joblib
import logging

logger = logging.getLogger("jobguard.loader")

MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml_models")


def load_all_models():
    """Load all four pickle files at startup. If any file is missing or corrupted, raise RuntimeError."""
    models = {}
    files = {
        "pipeline": os.path.join(MODEL_DIR, "pipeline.pkl"),
        "shap_explainer": os.path.join(MODEL_DIR, "shap_explainer.pkl"),
        "feature_names": os.path.join(MODEL_DIR, "feature_names.pkl"),
        "feature_cols": os.path.join(MODEL_DIR, "feature_cols.pkl"),
    }

    for name, path in files.items():
        if not os.path.exists(path):
            msg = f"Required model file not found: {path}"
            logger.error(msg)
            raise RuntimeError(msg)
        try:
            models[name] = joblib.load(path)
            logger.info(f"Loaded {name} from {path}")
        except Exception as e:
            msg = f"Failed to load model file {path}: {e}"
            logger.error(msg)
            raise RuntimeError(msg)

    pipeline = models["pipeline"]
    shap_explainer = models["shap_explainer"]
    feature_names = models["feature_names"]
    feature_cols = models["feature_cols"]

    logger.info(f"All models loaded. feature_cols={feature_cols}, feature_names count={len(feature_names)}")

    return pipeline, shap_explainer, feature_names, feature_cols
