# Lab 3 — JavaScript Testing Exercises

Three independent exercises for practising unit tests, coverage, browser tests,
end-to-end tests, bundling, and documentation.

```text
lab3/
├── 1-money/
│   ├── node/       unit tests with Mocha + Chai, coverage with c8
│   └── web/        the same exercise running in the browser
├── 2-factorial/    unit tests with Mocha
└── 3-chess/        larger project: unit tests, Cypress, Rollup build, JSDoc
```

Each subproject has its own `package.json`. Install dependencies **inside the
folder you want to run**; there is no root package.

Requirements: **Node.js 20+**, npm, and internet access for `npm install` (and for
the CDN scripts in the browser exercise). The Cypress test also needs internet the
first time to download its browser binary.

---

## Quick reference

| Exercise | Folder | Install | Run tests |
| --- | --- | --- | --- |
| Money (Node) | `1-money/node` | `npm install` | `npm test` |
| Money (browser) | `1-money/web` | none | open `index.html` |
| Factorial | `2-factorial` | `npm install` | `npm test` |
| Chess | `3-chess` | `npm install` | `npm test` |

---

## 1. Money

The exercise implements a `Money` value with an `add()` operation and tests it with
Mocha + Chai. Tests cover adding compatible and incompatible currencies.

### Node version

```sh
cd lab3/1-money/node
npm install
npm test
```

Coverage:

```sh
npm run coverage   # console summary
npm run report     # HTML report in coverage/index.html
```

### Browser version

```sh
cd lab3/1-money/web
```

Open `index.html` in a browser. Mocha and Chai are loaded from `unpkg.com`, and
`test.money.js` runs automatically; results appear in the page. No install step is
needed, but the browser must be online.

---

## 2. Factorial

A `factorial` function with Mocha tests for valid values, zero, negatives, and
invalid input.

```sh
cd lab3/2-factorial
npm install
npm test
npm run coverage
npm run report
```

---

## 3. Chess

A small chess library (`src/`) with Mocha unit tests (`test/`), a Rollup bundle
(`dist/`), a browser UI (`web/`), generated JSDoc (`docs/`), saved games
(`games/`), and a Cypress end-to-end test.

```sh
cd lab3/3-chess
npm install
```

Commands:

| Command | What it does |
| --- | --- |
| `npm test` | Mocha unit tests (`test/*.js`) |
| `npm run coverage` | unit tests with c8 coverage |
| `npm run report` | HTML coverage report |
| `npm run build` | bundles `index.js` into `dist/chess.js` |
| `npm run doc` | generates JSDoc into `docs/` |
| `npm run serve` | serves the project on `http://localhost:8080` |

### Browser demo

```sh
npm run build
npm run serve
```

Open <http://localhost:8080/web/index.html>.

`dist/chess.js` is committed so the page works without building. After changing
`src/`, run `npm run build` again.

### Cypress end-to-end test

The spec opens `http://localhost:8080/web/index.html`, so the static server must be
running.

```sh
# terminal 1
cd lab3/3-chess
npm run serve

# terminal 2
cd lab3/3-chess
npx cypress run     # headless
# or: npx cypress open
```

Note: `cypress.config.js` uses the `mochawesome` reporter, which is not listed in
`devDependencies`. Install it before running Cypress:

```sh
npm install --save-dev mochawesome
```

---

## Notes

- `node_modules/` and `coverage/` are **not** committed; run `npm install` in each
  subproject before executing it.
- `lab3/3-chess/dist/chess.js` is intentionally tracked because the web demo loads
  it.
- Port `8080` is also used by the Lab 2 native server. Do not run
  `npm run serve` from chess and Lab 2's `npm start` at the same time.
- The factorial test file uses `it.only`; only the marked tests run under Mocha.
