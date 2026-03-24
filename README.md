# Gestion PFE — Technical Documentation

> RESTful API for managing end-of-studies projects (Projet de Fin d'Études), built with **Node.js**, **Express 5**, **MongoDB/Mongoose 9**, and **Zod** validation.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Projects](#projects)
  - [Sprints](#sprints)
  - [User Stories](#user-stories)
  - [Tasks](#tasks)
  - [Meetings (Réunions)](#meetings-réunions)
  - [Validations](#validations)
  - [Reports](#reports)
  - [Report History](#report-history)
  - [Generated Reports (HTML)](#generated-reports-html)
- [Data Models](#data-models)
- [Middleware Pipeline](#middleware-pipeline)
- [Validation Layer](#validation-layer)
- [Role-Based Access Control](#role-based-access-control)
- [Swagger Documentation](#swagger-documentation)

---

## Architecture Overview

The API follows a **layered architecture** with clear separation of concerns:

```
Client Request
    │
    ▼
  Routes ─── define endpoints, attach middleware chains
    │
    ▼
  Validators ─── Zod schemas (body, params, query)
    │
    ▼
  Middleware ─── JWT auth, role enforcement, file upload
    │
    ▼
  Controllers ─── request/response orchestration, business logic
    │
    ▼
  Services ─── data access layer (Mongoose queries)
    │
    ▼
  Models ─── Mongoose schemas (MongoDB collections)
```

---

## Tech Stack

| Layer           | Technology                                                  |
| --------------- | ----------------------------------------------------------- |
| Runtime         | Node.js (ES Modules)                                        |
| Framework       | Express 5.1                                                 |
| Database        | MongoDB via Mongoose 9                                      |
| Authentication  | JWT (`jsonwebtoken` 9.x) + `bcrypt`/`bcryptjs`              |
| Validation      | Zod 4                                                       |
| File Upload     | Multer 2 (PDF only)                                         |
| API Docs        | Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)          |
| Utilities       | `uuid`, `validator`, `glob`, `dotenv`, `cors`                |
| Dev Tooling     | Nodemon 3                                                   |

---

## Project Structure

```
gestion-PFE/
├── server.js                     # Entry point — DB connect + HTTP listen
├── package.json                  # Dependencies & scripts
├── .env                          # Environment variables (not committed)
│
├── src/
│   ├── app.js                    # Express app config, route mounting, Swagger
│   │
│   ├── config/
│   │   └── db.js                 # MongoDB connection (mongoose.connect)
│   │
│   ├── models/                   # Mongoose schemas
│   │   ├── user.model.js         # User: email, password (bcrypt), name, role
│   │   ├── project.model.js      # Project: title, dates, students[], supervisors
│   │   ├── sprint.model.js       # Sprint: project_id, number (unique/project), status
│   │   ├── UserStory.model.js    # UserStory: title, dates, sprintId, projectId
│   │   ├── task.model.js         # Task: title, status, priority, refs to story/sprint/project
│   │   ├── TaskHistory.model.js  # TaskHistory: audit trail for status changes
│   │   ├── meeting.model.js      # Meeting (Réunion): agenda, status, polymorphic refs
│   │   ├── validation.model.js   # Validation: task/meeting approval records
│   │   └── report.model.js       # Report: PDF file metadata + versioning
│   │
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js          # register, login
│   │   ├── project.controller.js       # CRUD + dashboard
│   │   ├── sprint.controller.js        # CRUD + dashboard
│   │   ├── userstory.controller.js     # CRUD
│   │   ├── task.controller.js          # CRUD + status updates + history
│   │   ├── meeting.controller.js       # CRUD + complete/cancel + content validation
│   │   ├── validation.controller.js    # Task & meeting validations
│   │   ├── report.controller.js        # PDF upload
│   │   ├── reportHistory.controller.js # List/download report versions
│   │   ├── projectReport.controller.js # HTML project report generator
│   │   └── sprintReport.controller.js  # HTML sprint report generator
│   │
│   ├── services/                 # Data access layer
│   │   ├── project.service.js          # Dashboard aggregation
│   │   ├── meeting.service.js          # Full CRUD + status filters
│   │   ├── task.service.js             # CRUD with population
│   │   ├── userStory.service.js        # CRUD scoped to project/sprint
│   │   ├── validation.service.js       # Create + list by task/meeting
│   │   ├── report.service.js           # Version creation
│   │   └── reportHistory.service.js    # List + download
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT Bearer token verification → req.user
│   │   ├── roles.js              # requireRole(...roles) access control
│   │   ├── validate.js           # Zod schema validation middleware
│   │   ├── uploadReport.js       # Multer config (PDF only, uploads/reports/)
│   │   └── errorHandler.js       # Global error handler
│   │
│   ├── validators/               # Zod schemas
│   │   ├── meeting.validator.js        # Create/update/complete meeting schemas
│   │   ├── task.validator.js           # Create/update task schemas
│   │   ├── taskStatus.validator.js     # Status transition schema
│   │   ├── userStory.validator.js      # Create/update + date-within-sprint check
│   │   ├── validation.validator.js     # Task validation schema
│   │   └── report.validator.js         # Upload params/body schema
│   │
│   ├── helpers/
│   │   └── ProjectDashboard.js   # Formats aggregated dashboard data
│   │
│   └── utils/
│       ├── htmlReportProject.js  # Full project HTML report generator
│       └── htmlReportSprint.js   # Sprint-scoped HTML report generator
│
└── uploads/
    └── reports/                  # Stored PDF report files
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** instance (local or MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gestion-PFE

# Install dependencies
npm install

# Create a .env file (see Environment Variables below)

# Development mode (hot reload via Nodemon)
npm run dev

# Production mode
npm start
```

The server starts on `http://localhost:5000`. The root URL (`/`) redirects to the Swagger UI at `/api-docs`.

---

## Environment Variables

Create a `.env` file at the project root:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/gestion-pfe
JWT_SECRET=your_jwt_secret_key
```

| Variable     | Required | Default | Description                        |
| ------------ | -------- | ------- | ---------------------------------- |
| `PORT`       | No       | `5000`  | HTTP server port                   |
| `MONGO_URL`  | **Yes**  | —       | MongoDB connection string          |
| `JWT_SECRET` | **Yes**  | —       | Secret key for signing JWT tokens  |

---

## API Reference

**Base URL:** `http://localhost:5000/api`

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

### Authentication

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | `/auth/register` | Register a new user | No            |
| POST   | `/auth/login`    | Login → returns JWT | No            |

**Register — request body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "John Doe",
  "role": "etudiant"
}
```
Roles: `etudiant`, `encad_universitaire`, `encad_entreprise`

**Login — response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "...", "email": "...", "name": "...", "role": "etudiant" }
}
```
JWT payload: `{ userId, role }` — expires in **2 hours**.

---

### Projects

| Method | Endpoint                         | Description                           | Roles           |
| ------ | -------------------------------- | ------------------------------------- | --------------- |
| POST   | `/projects`                      | Create project                        | etudiant        |
| GET    | `/projects`                      | List projects (role-filtered)         | All authed      |
| GET    | `/projects/:projectId`           | Get single project                    | All authed      |
| PUT    | `/projects/:projectId`           | Update project                        | etudiant        |
| DELETE | `/projects/:projectId`           | Delete project                        | etudiant        |
| GET    | `/projects/:projectId/dashboard` | Aggregated project dashboard          | All authed      |

**Business rules:**
- Max **2 students** per project (validated by role).
- `end_date` must be ≥ today.
- Students see only their own projects; supervisors see assigned projects.

**Dashboard** returns: sprint list, task statistics (by status), progress %, pending validations, last 5 meetings, last 5 reports, and a sorted timeline (journal).

---

### Sprints

| Method | Endpoint                           | Description           | Roles      |
| ------ | ---------------------------------- | --------------------- | ---------- |
| POST   | `/projects/:projectId/sprints`     | Create sprint         | etudiant   |
| GET    | `/projects/:projectId/sprints`     | List project sprints  | All authed |
| GET    | `/sprints/:sprintId`               | Get sprint by ID      | etudiant   |
| PUT    | `/sprints/:sprintId`               | Update sprint         | etudiant   |
| DELETE | `/sprints/:sprintId`               | Delete sprint         | etudiant   |
| GET    | `/sprints/:sprintId/dashboard`     | Sprint dashboard      | All authed |

- **Statuses:** `planned` → `active` → `completed`
- Sprint `number` is unique per project (compound index on `project_id + number`).
- `end_date` must be ≥ `start_date`.

---

### User Stories

| Method | Endpoint                                                                      | Description       |
| ------ | ----------------------------------------------------------------------------- | ----------------- |
| POST   | `/user-stories/projects/:projectId/sprints/:sprintId/userStories`             | Create            |
| GET    | `/user-stories/projects/:projectId/sprints/:sprintId/userStories`             | List by sprint    |
| GET    | `/user-stories/projects/:projectId/sprints/:sprintId/userStories/:id`         | Get by ID         |
| PUT    | `/user-stories/projects/:projectId/sprints/:sprintId/userStories/:id`         | Update            |
| DELETE | `/user-stories/projects/:projectId/sprints/:sprintId/userStories/:id`         | Delete            |

User story dates are validated against the parent sprint's date range.

---

### Tasks

| Method | Endpoint                                                                           | Description              |
| ------ | ---------------------------------------------------------------------------------- | ------------------------ |
| POST   | `/tasks/projects/:projectId/sprints/:sprintId/userStories/:userStoryId/tasks`      | Create task              |
| GET    | `/tasks/projects/:projectId/tasks`                                                 | List tasks (filterable)  |
| GET    | `/tasks/:taskId`                                                                   | Get task by ID           |
| PUT    | `/tasks/:taskId`                                                                   | Update task              |
| DELETE | `/tasks/:taskId`                                                                   | Delete task              |
| PUT    | `/tasks/:taskId/status`                                                            | Change task status       |
| GET    | `/tasks/:taskId/history`                                                           | Status change audit log  |

- **Statuses:** `ToDo`, `InProgress`, `Standby`, `Done`
- **Priorities:** `Low`, `Medium`, `High`
- Every status change creates a `TaskHistory` record (old status, new status, changed by, timestamp, optional notes).
- **Query filters:** `?sprintId=...&status=...`

---

### Meetings (Réunions)

| Method | Endpoint                 | Description                              | Roles      |
| ------ | ------------------------ | ---------------------------------------- | ---------- |
| POST   | `/meetings`              | Create meeting with agenda               | etudiant   |
| GET    | `/meetings`              | List all (optional `?projectId=…`)       | All authed |
| GET    | `/meetings/upcoming`     | Planned future meetings                  | All authed |
| GET    | `/meetings/completed`    | Completed meetings                       | All authed |
| GET    | `/meetings/cancelled`    | Cancelled meetings                       | All authed |
| GET    | `/meetings/:id`          | Get meeting details                      | All authed |
| PUT    | `/meetings/:id`          | Update (only if not completed/cancelled) | All authed |
| PUT    | `/meetings/:id/complete` | Complete meeting with notes              | All authed |
| PUT    | `/meetings/:id/cancel`   | Cancel meeting                           | All authed |
| DELETE | `/meetings/:id`          | Delete meeting                           | All authed |

- **Statuses:** `Planifiee` → `Effectuee` | `Annulee`
- Meetings support **polymorphic references** via `referenceType` (`UserStory`, `Task`, `Report`) + `referenceId`.
- The `compteRendu` (meeting notes) is set when completing a meeting (20–5000 chars).
- Completed or cancelled meetings are **immutable**.

---

### Validations

| Method | Endpoint                                        | Description                   | Roles                                   |
| ------ | ----------------------------------------------- | ----------------------------- | --------------------------------------- |
| POST   | `/validations/tasks/:taskId/validate`           | Validate a task               | encad_entreprise, encad_universitaire   |
| GET    | `/validations/tasks/:taskId/validations`        | List validations for a task   | All authed                              |
| GET    | `/validations/reunions/:meetingId/validations`  | List validations for a meeting | All authed                             |

- **Validation types:** `Tache` (task) and `ContenuReunion` (meeting content).
- `meetingId` is optional — supports out-of-meeting validation.
- Each validation records: `estValide` (boolean), `commentaire`, `validatedBy`, `dateValidation`.

---

### Reports

| Method | Endpoint                                      | Description       | Roles    |
| ------ | --------------------------------------------- | ----------------- | -------- |
| POST   | `/reports/projects/:projectId/reports/upload`  | Upload report PDF | etudiant |

**Upload format:** `multipart/form-data`
- Field `file`: PDF file (required, only `application/pdf` accepted)
- Field `date`: Report date
- Field `version`: Version string (required)
- Field `notes`: Optional text

Files are stored in `uploads/reports/` with unique names: `report-{timestamp}-{random}.pdf`

---

### Report History

| Method | Endpoint                                                            | Description            |
| ------ | ------------------------------------------------------------------- | ---------------------- |
| GET    | `/report-histories/projects/:projectId/reports`                     | List all report versions |
| GET    | `/report-histories/projects/:projectId/reports/:reportId/download`  | Download PDF file      |

Reports are returned sorted by version descending.

---

### Generated Reports (HTML)

| Method | Endpoint                                                          | Description                     |
| ------ | ----------------------------------------------------------------- | ------------------------------- |
| GET    | `/project-reports/projects/:projectId/report`                     | Full project HTML report        |
| GET    | `/sprint-reports/projects/:projectId/sprints/:sprintId/report`    | Sprint-scoped HTML report       |

These endpoints return **styled HTML documents** containing:
- Task statistics (total, done, in progress, standby, todo) with progress bars
- Sprint summary tables with task counts and completion percentages
- Complete task listing with color-coded status and priority badges
- Task status change history (limited to 50 entries for project reports)

---

## Data Models

### Entity Relationship Diagram

```
User
 ├──< Project (students[], company_supervisor, university_supervisor)
 │       ├──< Sprint (project_id)
 │       │       └──< UserStory (sprintId, projectId)
 │       │               └──< Task (userStoryId, sprintId, projectId, createdBy)
 │       │                       ├──< TaskHistory (taskId, changedBy)
 │       │                       └──< Validation (taskId, validatedBy)
 │       ├──< Meeting (projectId, createdBy, referenceType/referenceId)
 │       │       └──< Validation (reunionId, validatedBy)
 │       └──< Report (projectId)
 └── Validation (validatedBy)
```

### Schema Summary

| Model           | Collection        | Key Fields                                                                    |
| --------------- | ----------------- | ----------------------------------------------------------------------------- |
| **User**        | `users`           | `email` (unique), `password` (bcrypt), `name`, `role` (enum: 3 values)        |
| **Project**     | `projects`        | `title`, `description`, `start_date`, `end_date`, `students[]` (max 2), supervisor refs |
| **Sprint**      | `sprints`         | `project_id`, `number` (unique/project), `title`, `start_date`, `end_date`, `status` |
| **UserStory**   | `userstories`     | `title`, `description`, `start_date`, `end_date`, `sprintId`, `projectId`     |
| **Task**        | `tasks`           | `title`, `description`, `status`, `priority`, `userStoryId`, `sprintId`, `projectId`, `createdBy` |
| **TaskHistory** | `taskhistories`   | `taskId`, `oldStatus`, `newStatus`, `changedBy`, `notes`, `changedAt`         |
| **Meeting**     | `reunions`        | `projectId`, `datePlanification`, `ordreDuJour`, `compteRendu`, `statut`, `referenceType`/`referenceId` |
| **Validation**  | `validations`     | `taskId`?, `reunionId`?, `estValide`, `commentaire`, `validatedBy`, `typeValidation` |
| **Report**      | `reports`         | `projectId`, `date`, `fileName`, `filePath`, `version`, `notes`               |

### User Roles

| Role                   | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `etudiant`             | Student — creates/manages projects, sprints, tasks, reports    |
| `encad_universitaire`  | University supervisor — validates tasks and meeting content     |
| `encad_entreprise`     | Company supervisor — validates tasks                           |

---

## Middleware Pipeline

A typical protected request passes through:

```
Request → cors() → express.json() → Route Match
   → loggedMiddleware (JWT)
   → requireRole(...roles)
   → validate(zodSchema)
   → Controller
   → Response | errorHandler
```

### Authentication (`middleware/auth.js`)
1. Extracts Bearer token from `Authorization` header.
2. Verifies JWT signature with `JWT_SECRET`.
3. Loads user from DB (excludes password).
4. Attaches user object to `req.user`.
5. Returns **401** on missing/invalid token or user not found.

### Role Authorization (`middleware/roles.js`)
- Factory: `requireRole("etudiant", "encad_universitaire")`
- Checks `req.user.role` ∈ allowed roles.
- Returns **403** if denied.

### Request Validation (`middleware/validate.js`)
- `validate(schema)` — validates combined body + params + query.
- `validateRequest({ params, body, query })` — validates each section with separate schemas.
- Returns **400** with structured Zod errors: `{ field, message, value, code }`.

### File Upload (`middleware/uploadReport.js`)
- **Engine:** Multer disk storage.
- **Destination:** `uploads/reports/`
- **Filename pattern:** `report-{Date.now()}-{random}.{ext}`
- **Filter:** Only `application/pdf` accepted.

### Error Handler (`middleware/errorHandler.js`)
Handles all uncaught errors at the Express level:

| Error Type              | HTTP Status | Description                        |
| ----------------------- | ----------- | ---------------------------------- |
| Mongoose ValidationError | 400        | Schema validation failure           |
| Mongoose CastError       | 400        | Invalid ObjectId format             |
| MongoDB 11000            | 400        | Duplicate key violation             |
| JsonWebTokenError        | 401        | Invalid token                       |
| TokenExpiredError        | 401        | Expired token                       |
| Other                    | 500        | Internal server error               |

Stack traces are included in responses when `NODE_ENV !== 'production'`.

---

## Validation Layer

All input validation uses **Zod** schemas in `src/validators/`:

| Validator               | Validates                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| `meeting.validator`     | Create (future date, 10–2000 char agenda), update, complete (20–5000 char notes) |
| `task.validator`        | Create (title 3–255, desc 10+, priority enum, ObjectId params), update, list filters |
| `taskStatus.validator`  | Status enum + optional notes (max 500 chars)                            |
| `userStory.validator`   | Create/update + custom middleware to verify dates fall within sprint range |
| `validation.validator`  | `isValid` boolean, optional comment (max 1000), optional meetingId      |
| `report.validator`      | ProjectId param, upload body (date, version, optional notes)            |

Key validation patterns:
- **ObjectId format** checks on all resource identifiers
- **String length** constraints with min/max
- **Date parsing** with future-date enforcement where applicable
- **Enum validation** for statuses, priorities, roles
- **Cross-field validation** (e.g., user story dates ⊆ sprint date range)
- **Conditional required fields** (e.g., `taskId` required when `typeValidation === "Tache"`)

---

## Role-Based Access Control

| Action                              | etudiant | encad_universitaire | encad_entreprise |
| ----------------------------------- | :------: | :-----------------: | :--------------: |
| Register / Login                    | ✅       | ✅                  | ✅               |
| Create / Edit / Delete projects     | ✅       | ❌                  | ❌               |
| Create / Edit / Delete sprints      | ✅       | ❌                  | ❌               |
| Create / Edit / Delete tasks        | ✅       | ❌                  | ❌               |
| Create / Edit / Delete user stories | ✅       | ❌                  | ❌               |
| Upload reports                      | ✅       | ❌                  | ❌               |
| Create / Manage meetings            | ✅       | ❌                  | ❌               |
| Validate tasks                      | ❌       | ✅                  | ✅               |
| Validate meeting content            | ❌       | ✅                  | ✅               |
| View projects (own scope)           | ✅       | ✅                  | ✅               |
| View dashboards & reports           | ✅       | ✅                  | ✅               |
| Download reports                    | ✅       | ✅                  | ✅               |

---

## Swagger Documentation

Interactive API documentation is auto-generated from **JSDoc** annotations in route files using `swagger-jsdoc`. It is served at:

```
http://localhost:5000/api-docs
```

The Swagger config uses `glob` to discover all `*.routes.js` files automatically. The root URL (`/`) redirects to the Swagger UI.
