# Lab 2: Implementing a REST server in Node.JS with Express.JS

**Authors**
*   Laura Sofía Gómez Rosales  [![GitHub Slrosales](https://img.shields.io/badge/by-Slrosales-purple)](https://github.com/Slrosales)
*   Maria Camila Pinzon Niño [![GitHub mcnino15](https://img.shields.io/badge/by-mcnino15-red)](https://github.com/mcnino15)

REST API for the **Master 2 MOSIG** department, written in Node.js. The project started as an Express.js application and was then rebuilt from scratch on top of Node's native `node:http` module, extracting the reusable server logic into a small package.

Two implementations live side by side:

| Implementation | Location | Port | Entry point |
| --- | --- | --- | --- |
| Native `node:http` + `tiny-router` | `lab2/` | `8080` | `lab2/index.js` |
| Original Express.js version | `express/` | `3000` | `express/index.js` |

Both read and write the same `data.json`.

---

## Table of contents

- [Lab 2: Implementing a REST server in Node.JS with Express.JS](#lab-2-implementing-a-rest-server-in-nodejs-with-expressjs)
  - [Table of contents](#table-of-contents)
  - [What the API does](#what-the-api-does)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Running the servers](#running-the-servers)
  - [API reference](#api-reference)
    - [Endpoints](#endpoints)
    - [Examples](#examples)
  - [Repository structure](#repository-structure)
  - [Architecture](#architecture)
    - [Request lifecycle](#request-lifecycle)
    - [`tiny-router` API](#tiny-router-api)
  - [How routing and body parsing work](#how-routing-and-body-parsing-work)
    - [Dynamic routes](#dynamic-routes)
    - [Payload handling](#payload-handling)
  - [Development workflow](#development-workflow)
    - [Manual smoke test](#manual-smoke-test)
  - [Design notes and limitations](#design-notes-and-limitations)
  - [Troubleshooting](#troubleshooting)

---

## What the API does

The server exposes the Mosig department as REST resources:

- the department itself, with links to its resources and its three heads
- students (`ine` is the identifier)
- professors (`number` is the identifier)
- modules (`code_module` is the identifier)

Responses are **partial representations** connected by `_links` (a HATEOAS-style convention): `GET /` does not embed all 100 students, it links to `/students`.

---

## Requirements

- **Node.js 20.11 or newer**
- **npm** (bundled with Node)
- Data lives in `data.json`

ES Modules are enabled by `"type": "module"` in `package.json`, so the project uses `import`/`export`, not `require`.

---

## Installation

```sh
git clone https://github.com/Slrosales/Minimal_REST-server.git
cd Minimal_REST-server/lab2
npm install
```

`npm install` installs:

- `express` and `body-parser`, used only by the legacy implementation in `express/`
- `tiny-router`, a **local package** (`packages/tiny-router`) declared as
  `"tiny-router": "file:packages/tiny-router"`

The local package is installed as a symlink:

```text
node_modules/tiny-router -> ../packages/tiny-router
```

Edits inside `packages/tiny-router` are therefore picked up immediately; no reinstall is needed after changing the package.

---

## Running the servers

Native implementation (default):

```sh
npm start
# or: node index.js
# -> http://localhost:8080
```

Legacy Express implementation:

```sh
npm run start:express
# or: node express/index.js
# -> http://localhost:3000
```

The two servers use different ports, so they can run at the same time in two terminals. Node does not reload files automatically: stop with `Ctrl+C` and star again after editing (or use `node --watch index.js`).

---

## API reference

Both implementations expose the same resources. `GET /modules/:code_module` is currently implemented only in the native server; the Express version supports the module list, create, and update routes.

Base URLs:

- native: `http://localhost:8080`
- Express: `http://localhost:3000`

### Endpoints

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| `GET` | `/` | department summary, links, and heads | `200` |
| `GET` | `/students` | partial list of students | `200` |
| `GET` | `/students/:ine` | one student | `200` / `404` |
| `POST` | `/students` | create a student | `201` / `400` / `409` |
| `PUT` | `/students/:ine` | update a student (partial merge) | `200` / `400` / `404` |
| `GET` | `/profs` | partial list of professors | `200` |
| `GET` | `/profs/:number` | one professor | `200` / `404` |
| `POST` | `/profs` | create a professor | `201` / `400` / `409` |
| `PUT` | `/profs/:number` | update a professor | `200` / `400` / `404` |
| `GET` | `/modules` | partial list of modules | `200` |
| `GET` | `/modules/:code_module` | one module (native only) | `200` / `404` |
| `POST` | `/modules` | create a module | `201` / `400` / `409` |
| `PUT` | `/modules/:code_module` | update a module | `200` / `400` / `404` |
| any | anything else | fallback | `404` |

Status codes used:

- `200 OK` — successful read or update
- `201 Created` — successful creation
- `400 Bad Request` — missing identifier or invalid JSON
- `404 Not Found` — no matching route or resource
- `409 Conflict` — creation would duplicate an identifier
- `500 Internal Server Error` — reading/writing `data.json` failed

### Examples

```sh
# department summary
curl http://localhost:8080/

# one student
curl http://localhost:8080/students/657395330O

# list (query strings are parsed into req.query)
curl 'http://localhost:8080/students?module=WEB01'
```

```sh
# create a student
curl -X POST http://localhost:8080/students \
  -H 'Content-Type: application/json' \
  -d '{
    "lastname": "Rosales",
    "firstname": "Laura",
    "email": ["slrosales@mosig.fr"],
    "followed_modules": ["WEB01"],
    "birthdate": "2000-01-01",
    "ine": "123456789A"
  }'

# partial update: the identifier always comes from the URL
curl -X PUT http://localhost:8080/students/123456789A \
  -H 'Content-Type: application/json' \
  -d '{"firstname":"Camila"}'
```

Create payload identifiers:

| Resource | Required identifier |
| --- | --- |
| student | `ine` |
| professor | `number` |
| module | `code_module` |

Writes are persisted to `data.json` with `JSON.stringify(data, null, 2)`. The PUT
handlers merge the payload into the existing record but keep the identifier from
the URL, so a client cannot rename a resource through the body.

Example `GET /` response:

```json
{
  "name": "Master 2 MOSIG",
  "_links": {
    "students": { "href": "/students" },
    "profs": { "href": "/profs" },
    "modules": { "href": "/modules" },
    "head": [
      { "name": "Sonni M.", "href": "/profs/697453889" },
      { "name": "Annice T.", "href": "/profs/547367905" },
      { "name": "Marsiella N.", "href": "/profs/251962930" }
    ]
  }
}
```

---

## Repository structure

```text
lab2/
├── index.js                     # native app: route table + start (8080)
├── data.js                      # loadData / saveData for the app
├── data.json                    # the Mosig dataset (shared by both apps)
├── controllers/                 # app-specific handlers
│   ├── MainController.js
│   ├── StudentController.js
│   ├── ProfController.js
│   └── ModuleController.js
├── packages/
│   └── tiny-router/             # reusable, application-independent package
│       ├── package.json
│       ├── .npmignore
│       └── src/
│           ├── index.js         # public exports
│           ├── Router.js        # route registration, regex params, dispatch
│           ├── body.js          # collectBody: chunks -> JSON
│           ├── response.js      # sendJson
│           └── server.js        # createServer: http + body + dispatch
├── express/                     # original Express implementation (legacy)
│   ├── index.js
│   ├── data.js
│   └── controllers/
├── lessons.md                   # concept-by-concept learning notes
├── package.json                 # mosig-server, depends on tiny-router
├── package-lock.json
└── README.md
```

`node_modules/` and build output are ignored by git. The `packages/tiny-router/.npmignore` and the `files` field in its `package.json` keep the published package limited to `src/`.

---

## Architecture

The application is split by responsibility:

| Layer | Location | Responsibility |
| --- | --- | --- |
| Framework | `packages/tiny-router` | HTTP server, routing, params, query, body parsing, JSON responses |
| Application | `index.js` | the route table for the Mosig API |
| Controllers | `controllers/` | validate input, build representations, call the data layer |
| Data access | `data.js` | read/write `data.json` |
| Data | `data.json` | the Mosig dataset |

The framework knows nothing about students, modules, or `data.json`. Anything Mosig-specific stays in the application, so `tiny-router` could be reused with a different dataset or domain.

### Request lifecycle

```text
client
  └─ HTTP request
       └─ tiny-router: createServer
            ├─ collectBody  (read chunks, parse JSON, set req.body)
            └─ Router.dispatch
                 ├─ match method + path regex
                 ├─ fill req.params and req.query
                 └─ controller
                      ├─ loadData()      (data.js -> data.json)
                      ├─ build representation
                      └─ sendJson(res, status, body)
```

### `tiny-router` API

```js
import { Router, createServer, collectBody, sendJson } from 'tiny-router';

const router = new Router();

router.get('/students', handler);
router.get('/students/:ine', handler);
router.post('/students', handler);
router.put('/students/:ine', handler);
router.delete('/students/:ine', handler);

createServer(router, 8080);
```

| Export | Purpose |
| --- | --- |
| `Router` | route table with `get/post/put/delete/dispatch` |
| `createServer(router, port, callback?)` | creates the `http.Server`, collects bodies, dispatches, listens |
| `collectBody(req, callback)` | gathers stream chunks into a Buffer, decodes UTF-8, parses JSON |
| `sendJson(res, status, body)` | writes status and `Content-Type: application/json`, then ends |

The router sets three properties on the request before calling a handler:

- `req.params` — values from dynamic segments, e.g. `/students/:ine`
- `req.query` — parsed query string
- `req.body` — parsed JSON body, or `undefined` when there is no body

The legacy Express app keeps the same controller/data layout with Express-specific
response calls (`res.status(...).json(...)`) and `body-parser`.

---

## How routing and body parsing work

### Dynamic routes

A route such as `/students/:ine` is converted at registration time:

```text
/students/:ine  ->  ^/students/([a-zA-Z0-9-]+)/?$
```

The router stores:

- the compiled `RegExp`
- the parameter names (`['ine']`)
- the handler

At dispatch time it tests `req.method` and matches `url.pathname`. On a match, the
captured groups are mapped back to their names:

```text
/students/657395330O  ->  match[1] = "657395330O"  ->  req.params.ine
```

Registration order matters when patterns can overlap; register static paths before parameterized ones. A trailing slash is optional (`/students` and `/students/` both match). Literal regex characters in paths are escaped.

### Payload handling

The native server does its own equivalent of `body-parser`:

1. listen for `data` events and push chunks into an array
2. on `end`, concatenate with `Buffer.concat` and decode as UTF-8
3. `JSON.parse` the result
4. assign it to `req.body` before dispatching
5. reply `400` if parsing fails

`Buffer.concat` is used instead of string concatenation so multi-byte UTF-8
characters split across chunks are decoded correctly.

The native server parses any non-empty body as JSON, even without a
`Content-Type` header. The Express version relies on `body-parser`, which only
parses `application/json`. Always send the header:

```sh
-H 'Content-Type: application/json'
```

---

## Development workflow

- Edit application code in `controllers/` or `index.js`.
- Edit framework code in `packages/tiny-router/src/`; the `file:` dependency is a
  symlink, so no reinstall is needed.
- Restart the server after changes.
- Both servers share `data.json`; writes from one are visible to the other on the
  next request.

Optional: work on the package as a separate project with `npm link`.

```sh
# in the package
cd packages/tiny-router
npm link

# in the application
cd ../../
npm link tiny-router
```

Check what would be published:

```sh
cd packages/tiny-router
npm pack --dry-run
```

Current scripts:

| Command | Action |
| --- | --- |
| `npm start` | native server on `8080` |
| `npm run start:express` | Express server on `3000` |
| `npm test` | placeholder (no automated tests yet) |

### Manual smoke test

```sh
curl -i http://localhost:8080/
curl -i http://localhost:8080/students
curl -i http://localhost:8080/students/657395330O
curl -i http://localhost:8080/profs/697453889
curl -i http://localhost:8080/modules/OOP
curl -i http://localhost:8080/nope
```

Expected: `200` for existing resources, `404` for `/nope`, JSON bodies with `Content-Type: application/json`.

---

## Design notes and limitations

This is a practice lab, so:

- **JSON file storage.** Every write rewrites `data.json`. There is no locking, no
  transactions, and no concurrency control; simultaneous writes can lose data.
- **Blocking I/O.** `readFileSync`/`writeFileSync` are simple but block the event
  loop. A production server would use async I/O or a database.
- **Minimal validation.** Only the identifier is required on create/update. Fields
  are not type-checked and unknown fields are stored as sent.
- **No payload limit.** Bodies are buffered in memory without a size cap.
- **No authentication, authorization, CORS, or pagination.**
- **Hardcoded ports.** `8080` (native) and `3000` (Express); no environment
  configuration.
- **No DELETE routes** yet, although the router supports `delete`.
- **No automated tests.** Verification is manual with `curl`.
- **Two implementations.** The Express code is kept for comparison and documents
  the earlier lab stage; new work goes into the native implementation.

---

## Troubleshooting
(base on our experiences developing this)

| Symptom | Cause | Fix |
| --- | --- | --- |
| `EADDRINUSE` on `8080`/`3000` | an older server is still running | stop it with `Ctrl+C` or `kill <pid>` |
| Response does not reflect your edits | Node loaded the old file | restart the server |
| `Cannot find package 'tiny-router'` | dependencies were not installed | run `npm install` in `lab2/` |
| `ENOENT ... data.json` | the data file is missing or was moved | keep `data.json` next to `data.js` in `lab2/` |
| Request hangs forever | a handler did not send a response | always call `sendJson`/`res.end()` |
| `req.body` is `undefined` (Express) | missing `Content-Type: application/json` | send the header or use `bodyParser.urlencoded(...)` |
| `Invalid JSON payload` | malformed JSON in the request | validate the body before sending |
| `404` on a known route | stale server or wrong port | check `8080` vs `3000`, restart |
| `require is not defined` | CommonJS call in an ESM project | use `import` |

---

