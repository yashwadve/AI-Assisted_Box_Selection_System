# AI Assisted Box Selection System

Automatically recommends the cheapest shipping box that can actually fit an order, using real 3D bin packing (not just per-item dimension checks).

## Features

- Product & Box catalog with strict validation (no zero/negative dimensions or weights)
- Create orders with multiple products and quantities
- True 3D bin-packing algorithm — checks if **all items together** physically fit in a box, with rotation support
- Rejects boxes on volume, weight, or failed packing — picks the cheapest one that passes
- REST API (Django REST Framework) + React frontend
- Full automated test suite (model validation, packing logic, API behavior)

## Tech Stack

**Backend:** Python, Django, Django REST Framework, SQLite
**Frontend:** React (Vite), Tailwind CSS, Axios, React Router

## How Recommendation Works

1. Expand every order line into individual units (quantity-aware).
2. Reject a box instantly if total volume or total weight exceeds its limits.
3. Otherwise, run a 3D bin-packing check (largest-item-first, 6-way rotation, guillotine space splitting) to confirm all units physically fit together.
4. Among boxes that pass, recommend the **cheapest**.
5. If none pass, return "No suitable box available."

## Project Structure

```
├── config/            # Django settings & root urls
├── catalog/           # Product, Box models + API
├── orders/            # Order, OrderItem models, packing logic, API
│   └── services.py    # Core packing/recommendation algorithm
├── frontend/          # React + Tailwind app
│   └── src/
│       ├── api/        # API client functions
│       ├── components/ # UI components
│       └── pages/       # Page views
└── requirements.txt
```

## Setup

**Backend:**
```bash
python -m venv venv
source venv/bin/activate      # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env          # set SECRET_KEY, DEBUG
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Add products/boxes via `http://127.0.0.1:8000/admin/`, then use the app at `http://localhost:5173`.

## Running Tests

```bash
python manage.py test
```

Covers: invalid/zero/negative input validation, single-item fit vs. no-fit, **combined multi-item/quantity packing failures**, weight limits, and cheapest-box selection.

## Assumptions / Limitations

- Packing uses a heuristic (largest-first, best-fit, guillotine split) — not an exhaustive solver, so it may occasionally reject a valid layout a perfect solver could find.
- No authentication — admin panel controls catalog data; API is open.
- Box selection is cost-based only; stock/availability isn't tracked.