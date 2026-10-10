# API Failure Twin - Deployment & Publishing Guide

This guide details how to publish and host **API Failure Twin** publicly so anyone can access it.

---

## 1. Instant Public Access Link (Live Now)

Your local development instance is currently tunneled and accessible online at:
* **Live Tunnel URL**: `https://wild-toys-grin.loca.lt`
* **Tunnel Verification Password (IP)**: `134.82.68.163`

> **Note on Localtunnel**: On the first visit from any new browser, Localtunnel displays a quick verification screen to prevent abuse. Enter the endpoint IP (`134.82.68.163`) or click **Click to Continue** to access the complete application.

---

## 2. Permanent Cloud Deployment Options (Free)

### Option A: Render.com (Recommended - 1-Click Free Hosting)

1. Push this project to your GitHub account (or create a new GitHub repository).
2. Go to [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings (or Render will automatically detect `render.yaml`):
   * **Runtime**: Python 3
   * **Build Command**:
     ```bash
     cd frontend && npm install && npm run build && cd .. && pip install -r backend/requirements.txt
     ```
   * **Start Command**:
     ```bash
     uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
     ```
5. Click **Create Web Service**. Within 2-3 minutes, Render will provide a permanent public link:
   `https://api-failure-twin.onrender.com`

---

### Option B: Railway.app

1. Go to [railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub Repo**.
3. Select your repository.
4. Railway will automatically detect the `Dockerfile` or `Procfile` and deploy your app with a custom `*.up.railway.app` URL.

---

### Option C: Docker Container (Any VPS / Cloud)

Run anywhere using Docker:
```bash
docker build -t api-failure-twin .
docker run -p 8000:8000 api-failure-twin
```

---

## 3. Architecture Summary

* **Frontend**: React 18, TypeScript, TailwindCSS, React Flow, Zustand. Built with Vite into `frontend/dist`.
* **Backend**: FastAPI, NetworkX, Uvicorn.
* **Unified Serving**: The FastAPI backend serves both the `/api/*` endpoints and the static SPA frontend from `frontend/dist`, allowing the entire project to run on a single port for zero-configuration deployments.
