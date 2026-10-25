export function collectBody(req, callback) {
  const chunks = [];
  let finished = false;

  const done = (err, body) => {
    if (finished) return;
    finished = true;
    callback(err, body);
  };

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');

    if (raw === '') {
      return done(null, undefined);
    }

    try {
      done(null, JSON.parse(raw));
    } catch (err) {
      done(err);
    }
  });

  req.on('error', (err) => {
    done(err);
  });
}
