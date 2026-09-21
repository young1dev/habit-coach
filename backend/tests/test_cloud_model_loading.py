import io
import os
import unittest
from unittest.mock import patch

import app.ml_engine as ml_engine


class FakeBlob:
    def __init__(self, payload):
        self.payload = payload

    def download_as_bytes(self):
        return self.payload


class FakeBucket:
    def __init__(self, payload):
        self.payload = payload

    def blob(self, name):
        return FakeBlob(self.payload)


class FakeStorageClient:
    def __init__(self, payload):
        self.payload = payload

    def bucket(self, name):
        return FakeBucket(self.payload)


class FakeJoblib:
    def __init__(self):
        self.loaded = None

    def load(self, file_obj):
        self.loaded = file_obj.read()
        return {"source": "cloud"}


class CloudModelLoadingTests(unittest.TestCase):
    def setUp(self):
        ml_engine._model_cache.clear()

    def tearDown(self):
        ml_engine._model_cache.clear()

    def test_load_model_reads_from_cloud_storage(self):
        fake_joblib = FakeJoblib()

        with patch.dict(
            os.environ,
            {
                "MODEL_SOURCE": "gcs",
                "MODEL_BUCKET": "test-bucket",
                "MODEL_OBJECT": "models/default.pkl",
            },
            clear=False,
        ):
            with patch.object(ml_engine, "joblib", fake_joblib):
                with patch.object(
                    ml_engine,
                    "storage",
                    type(
                        "S",
                        (),
                        {
                            "Client": staticmethod(
                                lambda: FakeStorageClient(b"pickle-data")
                            )
                        },
                    ),
                ):
                    model = ml_engine.load_model("default")

        self.assertEqual(model, {"source": "cloud"})
        self.assertEqual(fake_joblib.loaded, b"pickle-data")


if __name__ == "__main__":
    unittest.main()
