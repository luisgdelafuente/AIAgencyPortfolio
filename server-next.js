// server-next.js - A simple script to run Next.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    handle(req, res, parsedUrl).catch(err => {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js ready on http://localhost:${port}`);
  });
});