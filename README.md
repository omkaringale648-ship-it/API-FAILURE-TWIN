# API Failure Twin

> **Simulate API failures before they become incidents.**

API Failure Twin is a visual, deterministic dependency simulator for software systems. It models microservice dependencies, quantifies cascading blast radius, maps technical service failures to user-facing application features, and verifies mitigation strategies in a safe, synthetic simulation environment.

---

## Important Prototype Disclaimers

> **API Failure Twin is a synthetic simulation prototype.**
> * It does **not** connect to real production APIs.
> * It does **not** send live production traffic or execute destructive tests.
> * It does **not** predict real-world incidents or guarantee uptime percentages.
> * It does **not** measure real customer impact or collect real-world telemetry.
> 
> All simulation results are **100% deterministic**, reproducible, and calculated directly from the configured synthetic dependency graph via NetworkX.

---

## 1. Project Overview

Modern cloud-native and distributed applications consist of deeply nested dependencies across ingress proxies, authentication services, operational microservices, datastores, and third-party SaaS APIs. When an upstream dependency fails (e.g. an acquirer payment gateway crashes with HTTP 500 or exceeds rate quotas), downstream services experience cascading connection exhaustion, socket timeouts, and degraded user features.

**API Failure Twin** provides software engineers, site reliability engineers (SREs), and architects with an interactive, deterministic control dashboard to answer:
```
Failed Component
      ↓
Dependency Propagation
      ↓
Affected Services
      ↓
Affected User-Facing Features
      ↓
Dependency Depth
      ↓
Simulation Risk
      ↓
Explainable Impact
      ↓
Recommended Mitigation
      ↓
Before / After Mitigation Diff
```

---

## 2. Core Product Concept

The platform provides a controlled feedback loop:
1. **Inject Fault**: Choose a target service and fault primitive (HTTP 500, HTTP 429, Timeout, Latency Spike, Schema Drift).
2. **Propagate**: NetworkX evaluates the directed graph to identify all upstream callers transitively affected by the fault.
3. **Quantify Impact**: Calculates exact dependency depth distance, critical edges crossed, degraded user-facing features, and risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
4. **Explain**: Generates a graph-derived natural explanation of why the failure reached user endpoints.
5. **Mitigate**: Apply architectural resilience patterns (circuit breakers, secondary provider fallback, client token throttling, caching layers).
6. **Compare Before & After**: Inspect an element-by-element diff proving failure containment and service recovery.

---

## 3. High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│             BROWSER (React + React Flow + TS)          │
│   Interactive Dashboard • Visual Topology • State Diff │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON (HTTP)
┌───────────────────────────▼────────────────────────────┐
│               FASTAPI BACKEND (Python 3.13)            │
│   Pydantic Validation • CORS • Endpoints               │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             DETERMINISTIC SIMULATION ENGINE            │
│  ├── GraphEngine (NetworkX Directed Graph)             │
│  ├── ImpactEngine (Blast Radius & Feature Impact)      │
│  ├── RiskEngine (Deterministic Risk Scoring)           │
│  ├── MitigationEngine (Resiliency Strategy Simulation) │
│  └── TimelineEngine (Sequential Event Chronology)      │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              SYNTHETIC TOPOLOGY CONFIGURATION          │
│          backend/data/system.json & scenarios.json     │
└────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Stack

* **Framework**: React 18 with TypeScript
* **Build Tool**: Vite 5 (instant HMR and optimized production bundle)
* **Graph Canvas**: React Flow (`reactflow` 11) with custom interactive nodes, animated SVG edge strokes, minimap, and controls
* **Styling**: Tailwind CSS (engineering control dashboard aesthetic, dark slate/obsidian palette, rectangular cards, restrained status colors)
* **Icons**: Lucide React
* **Routing**: React Router DOM 6

---

## 5. Backend Stack

* **Web Framework**: FastAPI (high-performance asynchronous Python framework)
* **Server**: Uvicorn ASGI server
* **Schema Validation**: Pydantic v2
* **Graph & Network Algorithms**: NetworkX 3.7
* **Data Storage**: In-memory simulation cache + deterministic JSON configuration

---

## 6. Simulation Engine

The simulation engine is completely decoupled from FastAPI route handlers, ensuring testability:
* `backend/app/engine/graph_engine.py`: Loads topology and constructs `dependency_graph` (`source -> target`) and `propagation_graph` (`target -> source`).
* `backend/app/engine/impact_engine.py`: Traverses upstream callers, computes service states (`HEALTHY`, `FAILED`, `AFFECTED`, `DEGRADED`), and maps prerequisite dependencies to feature health.
* `backend/app/engine/risk_engine.py`: Evaluates blast radius scale, component criticality, and feature impact to output `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
* `backend/app/engine/mitigation_engine.py`: Simulates resilience strategies and generates state diffs.
* `backend/app/engine/timeline_engine.py`: Generates sequential millisecond-offset incident event logs.

---

## 7. NetworkX Graph Model

The dependency topology uses strict graph theory:
* **Dependency Vector**: Edge `(u, v)` represents `u depends on v`.
* **Propagation Vector**: When `v` fails, errors travel in reverse to all nodes that reach `v`.
* **Upstream Transitive Reachability**: Evaluated via `nx.descendants(propagation_graph, target)`.
* **Blast Depth**: Calculated via `nx.shortest_path_length()`.
* **Path Tracing**: Derived using `nx.all_simple_paths()`.

---

## 8. System Topology (10 Synthetic Nodes)

The platform models 10 realistic nodes arranged across architectural tiers:

| Node ID | Service Name | Type | Tier | Criticality | Depends On |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `user` | User Client | Client | 0 | High | `api-gateway` |
| `api-gateway` | API Gateway | Ingress Gateway | 1 | Critical | `auth-service`, `order-service`, `location-service` |
| `auth-service` | Auth Service | Internal Service | 2 | Critical | `database` |
| `order-service` | Order Service | Internal Service | 2 | High | `payment-service`, `database`, `notification-service` |
| `location-service`| Location Service | Internal Service | 2 | Medium | `maps-api` |
| `payment-service` | Payment Service | Internal Service | 3 | Critical | `payment-api` |
| `notification-service`| Notification Service| Internal Service | 3 | Low | *(none)* |
| `payment-api` | Payment API (Acquirer) | External API | 4 | Critical | *(leaf)* |
| `maps-api` | Maps API | External API | 3 | Medium | *(leaf)* |
| `database` | Primary Database | Database | 3 | Critical | *(leaf)* |

### Synthetic User-Facing Features Mapped:
* **Checkout Flow**: Depends on `order-service`, `payment-service`
* **Payment Processing**: Depends on `payment-service`, `payment-api`
* **Order Placement**: Depends on `order-service`, `payment-service`, `database`
* **Order Tracking**: Depends on `order-service`, `location-service`
* **User Login**: Depends on `auth-service`, `database`
* **Push & Email Notifications**: Depends on `notification-service`
* **Store & Address Geocoding**: Depends on `location-service`, `maps-api`

---

## 9. Failure Types Supported

The twin deterministically simulates exactly 5 failure types:
1. `HTTP 500`: Upstream unhandled exception or crash response code.
2. `HTTP 429`: Upstream rate quota breach; returns 429 Too Many Requests.
3. `TIMEOUT`: Upstream connection or gateway deadline timeout (>30s).
4. `HIGH LATENCY`: Upstream response latency spike (>5000ms), exhausting client connection pool.
5. `SCHEMA MISMATCH`: Upstream returns unexpected payload schema drift or missing mandatory keys.

---

## 10. Mitigation Engine

Deterministic mitigations mapped per failure type:
* **HTTP 500**: Fallback Secondary Provider, Exponential Backoff with Jitter, Dead Letter Queue Buffer.
* **HTTP 429**: Retry-After Token Bucket Throttling, Asynchronous Request Queue, Circuit Breaker.
* **TIMEOUT**: Strict 1500ms Timeout SLA with Circuit Breaker, Asynchronous Optimistic Processing.
* **HIGH LATENCY**: Stale-While-Revalidate Caching Layer, Concurrency Shedding, Graceful Latency Cap.
* **SCHEMA MISMATCH**: Tolerant Reader / Schema Validation Adapter, API Version Header Downgrade.

---

## 11. Local Setup

### Prerequisites
* **Python**: 3.10+ (Tested on 3.13)
* **Node.js**: v18+ (Tested on v20.18 LTS)
* **Package Manager**: npm

### Clone & Repository Structure
```bash
git clone <repository-url>
cd api-failure-twin
```

---

## 12. Environment Variables

Copy `.env.example` to `.env`:
```bash
# Backend
APP_ENV=simulation
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 13. Backend Run Command

1. Open a terminal in the root directory:
```bash
# Install Python dependencies
python -m pip install -r backend/requirements.txt

# Start FastAPI backend
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now running at `http://localhost:8000`.
* Interactive OpenAPI Docs: `http://localhost:8000/docs`
* Health Endpoint: `http://localhost:8000/api/health`

---

## 14. Frontend Run Command

1. Open a second terminal:
```bash
cd frontend

# Install npm dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
The frontend is now available at `http://localhost:3000`.

---

## 15. Production Build

To compile the frontend for production:
```bash
cd frontend
npm run build
```
This produces an optimized production bundle in `frontend/dist/`.

---

## 16. Deployment Instructions

### Option A: Monolithic / Static Hosting
1. Build frontend: `npm run build` in `frontend/`.
2. Host the static files in `frontend/dist/` on Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
3. Deploy the FastAPI backend on Railway, Render, Fly.io, or AWS EC2 / ECS.
4. Set `VITE_API_BASE_URL` on the frontend host pointing to your deployed backend URL.

### Option B: Docker Container
Run FastAPI with Gunicorn/Uvicorn workers, serving static frontend assets directly or behind an Nginx reverse proxy.

---

## 17. Custom Domain Configuration

To connect API Failure Twin to a custom domain:
1. Deploy the frontend to your hosting provider (e.g. Vercel / Netlify / Cloudflare Pages).
2. Deploy the backend to your cloud provider (e.g. Render / Railway / Fly.io).
3. In your hosting provider settings, add your custom domain (e.g., `twin.example.com`).
4. In your DNS provider (e.g., Cloudflare, Route53, Namecheap):
   * Add a `CNAME` record pointing `twin.example.com` to your frontend provider's assigned host.
   * Add a `CNAME` record pointing `api.example.com` to your backend provider's assigned host.
5. In your frontend hosting environment variables, configure:
   ```env
   VITE_API_BASE_URL=https://api.example.com/api
   ```
6. Verify SSL/TLS certificate generation and HTTPS connectivity.
7. Test the simulation flow end-to-end on your custom domain.

---

## 18. Canonical Demo Flow (Hackathon Walkthrough)

To present the MVP during a hackathon demo:

```
Step 1: Open http://localhost:3000
        Observe healthy system state and clean engineering aesthetic.

Step 2: Click "Launch Twin" (or navigate to /simulator).
        Observe the 10-node directed topology rendered in green (HEALTHY).

Step 3: In the Failure Simulator panel:
        - Target API: Select "Payment API"
        - Failure Type: Select "HTTP 500"
        - Duration: 10s
        - Severity: CRITICAL
        - Click "SIMULATE FAILURE" (or click "Primary Demo")

Step 4: Observe Propagation:
        - Payment API transitions to red (FAILED).
        - Upstream dependency edge flashes animated red dashes.
        - Payment Service transitions to red (FAILED).
        - Order Service transitions to amber (AFFECTED).
        - API Gateway and User Client transition to yellow (DEGRADED).
        - Checkout Flow & Payment Processing features are flagged as DEGRADED.
        - Dependency Depth is calculated as 4 Tiers.
        - Risk Level displays CRITICAL.

Step 5: Inspect Explanation:
        Read the deterministic graph root-cause:
        "Fault injection of HTTP 500 into Payment API halted normal contract responses.
         Failure propagated 4 tiers upstream... Checkout Flow depends on Order Service,
         which depends on Payment API."

Step 6: Recommend & Apply Mitigation:
        - Select "Fallback Secondary Provider"
        - Click "APPLY MITIGATION STRATEGY"

Step 7: Verify Recovery (Before vs After):
        - Risk level drops from CRITICAL to LOW.
        - Checkout Flow and Order Placement recover to HEALTHY.
        - Payment Service enters resilient DEGRADED mode.
        - Source failure remains safely isolated on Payment API.
        - Inspect the Before & After Diff table.

Step 8: Reset:
        Click "Reset State" to return the topology to the healthy baseline.
```

---

## 19. Testing & Validation

Backend simulation test suite can be run directly via Python:
```bash
python -c "from backend.app.engine.simulation_engine import SimulationEngine; from backend.app.models.requests import FailureRequest; e = SimulationEngine(); res = e.simulate_failure(FailureRequest(target_service='payment-api', failure_type='HTTP 500')); print('Risk:', res.risk_level); print('Depth:', res.dependency_depth); assert res.risk_level == 'CRITICAL'; print('Test passed!')"
```

Frontend type-check and bundle verification:
```bash
cd frontend && npm run build
```

---

## 20. Prototype Limitations

* **Deterministic Only**: The engine strictly executes defined rules and graph algorithms. It does not ingest live telemetry.
* **Synthetic Graph**: The 10-node system models an illustrative multi-tier e-commerce system. Custom enterprise graphs can be loaded via `backend/data/system.json`.
* **Zero Production Access**: By intentional design, the simulator will never trigger live API calls, ensuring 100% safety.
