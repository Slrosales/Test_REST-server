import http from 'node:http';
import { collectBody } from './body.js';
import { sendJson } from './response.js';

export function createServer(router, port, callback) {
  const server = http.createServer((req, res) => {
    collectBody(req, (err, body) => {
      if (err) {
        return sendJson(res, 400, { error: 'Invalid JSON payload' });
      }

      req.body = body;
      router.dispatch(req, res);
    });
  });

  server.listen(port, () => {
    if (callback) {
      callback();
    } else {
      console.log(`Listening on http://localhost:${port}`);
    }
  });

  return server;
}
