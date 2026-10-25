import { sendJson } from './response.js';

function toRouteRegex(path) {
  const keys = [];

  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = escaped.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '([a-zA-Z0-9-]+)';
  });

  const suffix = path.endsWith('/') ? '' : '/?';
  return { regex: new RegExp(`^${pattern}${suffix}$`), keys };
}

export class Router {
  constructor() {
    this.routes = [];
  }

  add(method, path, handler) {
    const { regex, keys } = toRouteRegex(path);
    this.routes.push({ method, path, regex, keys, handler });
  }

  get(path, handler) {
    this.add('GET', path, handler);
  }

  post(path, handler) {
    this.add('POST', path, handler);
  }

  put(path, handler) {
    this.add('PUT', path, handler);
  }

  delete(path, handler) {
    this.add('DELETE', path, handler);
  }

  dispatch(req, res) {
    const url = new URL(req.url, 'http://localhost');

    for (const route of this.routes) {
      if (route.method !== req.method) continue;

      const match = url.pathname.match(route.regex);
      if (!match) continue;

      req.params = {};
      route.keys.forEach((key, index) => {
        req.params[key] = match[index + 1];
      });
      req.query = Object.fromEntries(url.searchParams);

      try {
        return route.handler(req, res);
      } catch (err) {
        console.error(err);
        if (!res.headersSent) {
          sendJson(res, 500, { error: 'Internal Server Error' });
        } else {
          res.end();
        }
        return;
      }
    }

    sendJson(res, 404, { error: 'Not Found' });
  }
}
