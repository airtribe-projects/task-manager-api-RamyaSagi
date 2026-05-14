# Task Manager API

## Overview ##

This project is a REST API for managing tasks, built with Node.js and Express. Tasks are stored in memory and seeded from `task.json` at startup. The codebase is organized into routes, controllers, services, and data layers under `src/`.

Each task includes identification, text fields, completion status, priority, and a creation timestamp used for sorting and filtering.

## Prerequisites ##

- Node.js 18 or newer (see `engines` in `package.json`)

## Setup

1. Clone the repository and open the project directory.

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the server

From the project root:

```bash
node app.js
```

The server listens on **port 3000** by default. You should see: `Server is listening on 3000`.

For API examples below, the base URL is:

`http://localhost:3000`

## Task data model ##

| Field         | Type    | Description |
|---------------|---------|-------------|
| `id`          | number  | Unique identifier. Auto-generated unless an optional integer `id` is provided on create and is unused. |
| `title`       | string  | Required on create/update; non-empty after trimming. |
| `description` | string  | Required on create/update; non-empty after trimming. |
| `completed`   | boolean | Required on create/update. |
| `priority`    | string  | One of: `low`, `medium`, `high`. Optional on create (defaults to `medium`). Optional on update (unchanged if omitted). |
| `createdAt`   | string  | ISO 8601 timestamp. Set when the task is created; not modified on update. |

## API endpoints

### `GET /tasks`

Returns all tasks (after optional filtering), sorted by `createdAt`.

**Query parameters**

| Parameter   | Optional | Description |
|-------------|----------|-------------|
| `completed` | Yes      | If set, must be `true` or `false` (case-insensitive). Filters tasks by completion status. |
| `order`     | Yes      | Sort direction for `createdAt`: `asc` (default, oldest first) or `desc` (newest first). |

**Responses**

- `200` — JSON array of tasks.
- `400` — Invalid `completed` or `order`; body includes `message` and `errors` (array of strings).

---

### `GET /tasks/priority/:level`

Returns tasks whose `priority` matches `:level`.

**Path parameter**

| Parameter | Description |
|-----------|-------------|
| `level`   | `low`, `medium`, or `high` (case-insensitive). |

Results are sorted by `createdAt` ascending (same rules as `GET /tasks` with default `order`).

**Responses**

- `200` — JSON array of tasks (may be empty).
- `400` — Invalid priority level.

---

### `GET /tasks/:id`

Returns a single task by numeric id.

**Responses**

- `200` — JSON task object.
- `400` — Invalid id format (non-negative integer string required).
- `404` — Task does not exist (`{ "message": "Task not found" }`).

---

### `POST /tasks`

Creates a new task.

**Request body (JSON)**

| Field         | Required | Description |
|---------------|----------|-------------|
| `title`       | Yes      | Non-empty string. |
| `description` | Yes      | Non-empty string. |
| `completed`   | Yes      | Boolean. |
| `priority`    | No       | `low`, `medium`, or `high`. Defaults to `medium` if omitted. |
| `id`          | No       | Integer; must not match an existing task. |

**Responses**

- `201` — Created task as JSON.
- `400` — Validation or business rule error (`message` and `errors` where applicable).

---

### `PUT /tasks/:id`

Updates an existing task. Same body rules as create for `title`, `description`, and `completed`. If `priority` is omitted, the existing value is kept. `createdAt` is not updated.

**Responses**

- `200` — Updated task as JSON.
- `400` — Invalid id or validation error.
- `404` — Task not found.

---

### `DELETE /tasks/:id`

Deletes a task by id.

**Responses**

- `200` — JSON body includes the deleted task object.
- `400` — Invalid id format.
- `404` — Task not found.

---

## How to test the API

### Automated tests

Integration tests use **Supertest** against the Express app (no manual server required for tests):

```bash
node test/server.test.js
```

or:

```bash
npm test
```

### Manual testing with curl

Start the server (`node app.js`), then in another terminal:

**List all tasks (default sort: oldest first by `createdAt`)**

```bash
curl -s "http://localhost:3000/tasks"
```

**Filter by completion and sort newest first**

```bash
curl -s "http://localhost:3000/tasks?completed=false&order=desc"
```

**List tasks by priority**

```bash
curl -s "http://localhost:3000/tasks/priority/high"
```

**Get one task**

```bash
curl -s "http://localhost:3000/tasks/1"
```

**Create a task**

```bash
curl -s -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"My task","description":"Details here","completed":false,"priority":"low"}'
```

**Update a task** (replace `1` with a valid id)

```bash
curl -s -X PUT "http://localhost:3000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated details","completed":true,"priority":"high"}'
```

**Delete a task**

```bash
curl -s -X DELETE "http://localhost:3000/tasks/1"
```

**Trigger validation errors (examples)**

```bash
curl -s "http://localhost:3000/tasks?completed=maybe"
curl -s "http://localhost:3000/tasks/priority/urgent"
curl -s -X POST "http://localhost:3000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"Only title"}'
```

### Manual testing with Postman

1. Start the server with `node app.js`.
2. Create a request collection with base URL `http://localhost:3000`.
3. For **POST** and **PUT**, set **Body** to **raw** and **JSON**, and include the fields described above.
4. For **GET /tasks**, use the **Params** tab to add `completed` and/or `order` as query parameters.
5. Save responses or use **Tests** scripts to assert status codes (200, 201, 400, 404) as needed.

## Project structure (high level)

| Path | Role |
|------|------|
| `app.js` | Express app entry; mounts routes; starts HTTP server when run directly. |
| `task.json` | Seed task list (normalized at runtime with `priority` and `createdAt` if missing). |
| `src/routes/` | HTTP route definitions. |
| `src/controllers/` | Request/response handling and status codes. |
| `src/services/` | Validation, filtering, sorting, and business logic. |
| `src/data/` | In-memory task store. |
| `src/constants/` | Shared constants (e.g. allowed priorities). |
| `src/utils/` | Helpers (e.g. id parsing). |
| `test/` | Integration tests. |
