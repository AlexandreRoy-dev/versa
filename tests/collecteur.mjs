import { createHash } from 'node:crypto';
import { createServer } from 'node:http';

export function parseMultipart(body, boundary) {
  const delim = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = body.indexOf(delim);
  while (start !== -1) {
    let partStart = start + delim.length;
    if (body.subarray(partStart, partStart + 2).toString() === '--') break;
    if (body.subarray(partStart, partStart + 2).toString() === '\r\n') partStart += 2;
    const next = body.indexOf(delim, partStart);
    if (next === -1) break;
    let chunk = body.subarray(partStart, next);
    if (chunk.length >= 2 && chunk.subarray(-2).toString() === '\r\n') chunk = chunk.subarray(0, -2);
    const sep = chunk.indexOf('\r\n\r\n');
    if (sep === -1) break;
    const head = chunk.subarray(0, sep).toString('utf8');
    const content = chunk.subarray(sep + 4);
    const name = /name="([^"]*)"/.exec(head)?.[1] ?? '';
    const filename = /filename="([^"]*)"/.exec(head)?.[1];
    const type = /content-type:\s*([^\r\n]+)/i.exec(head)?.[1]?.trim() ?? '';
    parts.push({ name, filename, type, content });
    start = next;
  }
  return parts;
}

export function startCollecteur(port = 5199) {
  let last = null;
  const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/dernier') {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.setHeader('cache-control', 'no-store');
      res.end(JSON.stringify(last));
      return;
    }
    if (req.method !== 'POST') {
      res.statusCode = 404;
      res.end('introuvable');
      return;
    }
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 12 * 1024 * 1024) req.destroy();
      else chunks.push(chunk);
    });
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const contentType = String(req.headers['content-type'] || '');
      const match = /boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(contentType);
      const boundary = match?.[1] || match?.[2] || '';
      const fields = {};
      let file = null;
      if (boundary) {
        for (const part of parseMultipart(body, boundary)) {
          if (part.filename != null) {
            file = {
              name: part.name,
              filename: part.filename,
              type: part.type,
              size: part.content.length,
              sha256: createHash('sha256').update(part.content).digest('hex'),
              base64: part.content.toString('base64'),
            };
          } else if (part.name) {
            fields[part.name] = part.content.toString('utf8');
          }
        }
      }
      last = { method: 'POST', url: req.url, contentType, fields, file };
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<!doctype html><html lang="fr-CA"><meta charset="utf-8"><title>Reçu</title><h1>Candidature reçue (test local)</h1></html>');
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}
