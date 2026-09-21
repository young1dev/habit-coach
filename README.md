# Habit Coach UI

This project includes a FastAPI backend and a Vite + React frontend for a habit coaching app.

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm or bun
- A Google Cloud project with access to Cloud Storage if you want to load the ML model from cloud storage

## 1) Backend setup

From the backend folder:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# or on Windows PowerShell:
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with the required values:

```env
SECRET_KEY=replace-with-a-random-secret
MODEL_SOURCE=local
MODEL_BUCKET=
MODEL_OBJECT=

# Optional for GCS auth when running locally
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
```

### Cloud model configuration

If you want the backend to load the trained model from Supabase Storage instead of a local `.pkl` file, set:

```env
MODEL_SOURCE=supabase
MODEL_BUCKET=your-model-bucket-name
MODEL_OBJECT=models/default.pkl
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can also use `SUPABASE_ANON_KEY` if your storage policy allows anonymous read access, but the service role key is recommended for trusted server-side use.

If `MODEL_SOURCE` is not set to `supabase`, the app falls back to the local model file in:

```text
backend/app/models/default.pkl
```

## 2) Run the backend

```bash
cd backend
# activate the virtual env if needed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will run at:

```text
http://localhost:8000
```

## 3) Frontend setup

From the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend` if needed:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Then run the app:

```bash
npm run dev
```

The frontend typically runs at:

```text
http://localhost:5173
```

## 4) Auth configuration

The app uses JWT auth. The backend expects a `SECRET_KEY` for signing tokens. The frontend stores the login token in `localStorage` under the key:

```text
habit-coach-auth
```

If the token is expired or invalid, the frontend removes it and redirects the user back to the auth screen.

## 5) Common issues

### Model file not found

- If `MODEL_SOURCE=local`, ensure the file exists at:
  ```text
  backend/app/models/default.pkl
  ```

### Cloud reads fail

- Verify `MODEL_BUCKET` and `MODEL_OBJECT` values
- Verify the service account or ADC credentials
- Ensure the bucket allows read access from that identity

### Frontend cannot call the API

- Check `VITE_API_URL`
- Confirm the backend is running
- Verify CORS settings in [backend/app/main.py](backend/app/main.py)

## 6) Production notes

For deployment, prefer:

- a real secret manager for `SECRET_KEY`
- a dedicated cloud storage bucket for model artifacts
- a service account with least-privilege read access
- environment variables injected by your deployment platform

## 7) Useful commands

Backend:

```bash
cd backend
. .venv/bin/activate
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
```
