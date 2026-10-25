# Minimal REST Server

Course projects for **Lab 2** and **Lab 3**, kept in separate folders so each lab
can be run and reviewed independently.

```text
Minimal_REST-server/
├── lab2/    REST server for the Mosig department (Express + native node:http)
└── lab3/    JavaScript testing exercises (money, factorial, chess)
```

**Authors**

- Laura Sofía Gómez Rosales — [Slrosales](https://github.com/Slrosales)
- Maria Camila Pinzon Niño — [mcnino15](https://github.com/mcnino15)

---

## Lab 2 — REST server

A REST API for the Master 2 MOSIG department with two implementations:

- native `node:http` + the reusable `tiny-router` package (port `8080`)
- the original Express version (port `3000`)

Both read and write the same `lab2/data.json`. The full description, API reference,
and architecture are in [`lab2/README.md`](lab2/README.md).

Requirements: Node.js **20.11+**.

```sh
cd lab2
npm install
npm start                 # native server -> http://localhost:8080
npm run start:express     # Express server -> http://localhost:3000
```

The two servers can run at the same time because they use different ports.

---

## Lab 3 — Testing exercises

Three independent exercises, each with its own `package.json`:

| Folder | Topic | Commands |
| --- | --- | --- |
| `lab3/1-money/node` | money unit tests (Node + Mocha) | `npm install`, `npm test`, `npm run coverage` |
| `lab3/1-money/web` | same exercise in the browser | open `index.html` |
| `lab3/2-factorial` | factorial tests (Mocha) | `npm install`, `npm test`, `npm run coverage` |
| `lab3/3-chess` | chess project: unit tests, Cypress, build, docs | see below |

```sh
cd lab3/2-factorial
npm install
npm test
```

Chess:

```sh
cd lab3/3-chess
npm install
npm test           # Mocha unit tests
npm run build      # bundle to dist/
npm run doc        # generate JSDoc in docs/
npm run serve      # http-server on 8080
```

`npm run serve` also uses port `8080`, so do not run it at the same time as the
Lab 2 native server.

The `node_modules/` and `coverage/` folders from the Lab 3 branch are intentionally
not committed. Run `npm install` inside each exercise before using it.

---

## Notes

- Each lab is self-contained; install dependencies from the folder you want to run.
- Lab 2 keeps its own README, data, tests-by-curl instructions, and documentation.
- Generated output (`node_modules/`, `coverage/`, `dist/`) is ignored by git; the
  current `lab3/3-chess/dist/` file is kept because the browser demo references it.
