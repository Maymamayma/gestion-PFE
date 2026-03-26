# Gestion PFE Backend — Guidelines

**See root [AGENTS.md](../AGENTS.md) for project-wide context.**

Backend serves a **layered REST API** managing Final Year Projects (PFE) — projects, sprints, user stories, tasks, meetings, validations, reports.

## Structure

```
src/
├── app.js                 # Express app setup, middleware chain
├── config/db.js          # MongoDB connection
├── routes/               # Endpoint definitions (attach validators, middleware)
├── controllers/          # Request/response orchestration
├── services/             # Business logic
├── models/               # Mongoose schemas & queries
├── middleware/           # Auth, validation, error handling, file upload
├── validators/           # Zod schemas for request validation
├── helpers/              # Utilities (e.g., ProjectDashboard.js)
└── utils/                # General helpers
```

## Request Flow

```javascript
// Example route
app.post('/api/projects', 
  authenticate,              // Middleware: JWT validation
  authorize(['admin']),      // Middleware: Role check
  validateRequest(schema),   // Middleware: Zod validation
  ProjectController.create   // Handler
)
```

## Controllers

Pure orchestrators — no database queries:

```javascript
// ProjectController.create
async create(req, res, next) {
  try {
    // 1. Data already validated by middleware
    const { name, description } = req.body;
    
    // 2. Call service (contains business logic)
    const project = await ProjectService.create(name, description, req.user);
    
    // 3. Format and respond
    res.status(201).json(project);
  } catch (error) {
    next(error);  // Centralized error handler
  }
}
```

## Models

Mongoose schemas + basic CRUD only. Complex queries belong in **Services**.

```javascript
// project.model.js
const projectSchema = new Schema({
  name: { type: String, required: true },
  // ... fields
});

// Basic queries only
projectSchema.statics.findById = async (id) => { /* ... */ };
projectSchema.statics.findAll = async () => { /* ... */ };

module.exports = mongoose.model('Project', projectSchema);
```

## Services

Business logic, orchestration, model calls:

```javascript
// project.service.js
async create(name, description, user) {
  // Business logic here
  const project = new Project({ name, description, owner: user.id });
  await project.save();
  
  // Call other services/models as needed
  return project;
}

async getProjectDashboard(projectId) {
  const project = await Project.findById(projectId);
  const sprints = await Sprint.find({ project: projectId });
  const tasks = await Task.find({ sprint: { $in: sprints.map(s => s._id) } });
  return { project, sprints, tasks };  // Composed response
}
```

## Validation (Zod)

Schemas in `src/validators/`. Applied in route middleware:

```javascript
// validators/project.validator.js
const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
});

// routes/project.routes.js
app.post('/projects', 
  validateRequest(createProjectSchema),
  ProjectController.create
);

// validateRequest middleware unwraps and validates
```

## Middleware Chain

In order:

1. `authenticate` — JWT token validation, attach `req.user`
2. `authorize` — Role-based access control
3. `validateRequest` — Zod schema validation (body, params, query)
4. `uploadReport` — File upload handling (if needed)
5. **Controller**
6. `errorHandler` — Centralized error responses

Define custom combinations per route as needed.

## Error Handling

All errors flow to centralized handler in `src/middleware/errorHandler.js`:

```javascript
// In controllers/middleware, always use next():
catch (error) {
  next(error);  // errorHandler catches and formats
}
```

errorHandler formats responses consistently (status, message, details).

## Naming Conventions

- **Files**: camelCase (`projectService.js`, `userController.js`)
- **Exports**: Match file name (e.g., `projectService.js` exports `ProjectService`)
- **Functions**: camelCase (`findById`, `updateProject`)
- **Mongoose schemas**: PascalCase (`const projectSchema = ...`)
- **Collections**: Lowercase plural (auto-handled by Mongoose)

## API Patterns

### Pagination

Query params: `?page=1&limit=10`

```javascript
async list(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const items = await Model.find().skip(skip).limit(limit);
  res.json({ items, total: await Model.countDocuments(), page, limit });
}
```

### Filters

Query params: `?status=active&role=admin`

```javascript
const filters = {};
if (req.query.status) filters.status = req.query.status;
const items = await Model.find(filters);
```

### Relationships

Use MongoDB refs and Mongoose `populate()`:

```javascript
const taskSchema = new Schema({
  sprint: { type: Schema.Types.ObjectId, ref: 'Sprint', required: true },
});

// Fetch with populated refs
const task = await Task.findById(id).populate('sprint');
```

## Testing

Run backend tests (if configured):

```bash
npm run test       # Run tests
npm run test:watch # Watch mode
```

## Environment

`.env` file (not in repo). Required vars:
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `PORT` — Server port (default 3000)
- `NODE_ENV` — `development` or `production`

See `.env.example` for template.

## Common Tasks

### Add a new resource (e.g., Feature)

1. Create `src/models/feature.model.js` (Mongoose schema)
2. Create `src/services/feature.service.js` (business logic)
3. Create `src/controllers/feature.controller.js` (request handlers)
4. Create `src/validators/feature.validator.js` (Zod schemas)
5. Create `src/routes/feature.routes.js` (attach to app in app.js)

### Modify existing resource

1. Update schema if fields change
2. Update service logic
3. Add/update validators if payload changes
4. Add/update controller handlers if response format changes

### Debug a request

1. Check request middleware order in `app.js`
2. Verify route in `routes/` file
3. Step through controller → service → model
4. Check Mongoose query and `populate()` calls
5. Inspect error handler logs

## References

- **Project context**: [../docs/PROJECT_CONTEXT.md](../docs/PROJECT_CONTEXT.md)
- **Postman API examples**: [Team D - Validations & Réunions API.postman_collection.json](Team%20D%20-%20Validations%20&%20Réunions%20API.postman_collection.json)
- **Mongoose docs**: https://mongoosejs.com/
- **Express middleware**: https://expressjs.com/en/guide/using-middleware.html
- **Zod validation**: https://zod.dev/
