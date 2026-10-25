# Minimal REST Server

**Authors**
*   Laura Sofía Gómez Rosales  [![GitHub Slrosales](https://img.shields.io/badge/by-Slrosales-purple)](https://github.com/Slrosales)
*   Maria Camila Pinzon Niño [![GitHub mcnino15](https://img.shields.io/badge/by-mcnino15-red)](https://github.com/mcnino15)

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

