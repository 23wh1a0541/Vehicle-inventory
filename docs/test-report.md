# Test Report

## Backend API

Command:

```powershell
cd backend
..\.venv\Scripts\python.exe -m pytest -q
```

Result:

```text
13 passed
```

The suite covers registration, login, CORS preflight handling, authentication, admin authorization, vehicle creation/listing/search, purchasing, out-of-stock behavior, restocking, updates, and deletion.

## Frontend

Command:

```powershell
cd frontend
npm test
```

Result:

```text
Test Files  1 passed (1)
Tests       2 passed (2)
```

The frontend tests cover switching from login to registration and the administrator-only inventory controls, including disabled purchase behavior for out-of-stock vehicles.
