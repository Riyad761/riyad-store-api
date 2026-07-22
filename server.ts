import { createServer as createViteServer } from 'vite';
import path from 'path';

// Import Express App configuration
// @ts-ignore
import app from './app.js';
// @ts-ignore
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  // Initialize Database connection (or memory store mode)
  await connectDB();

  // Mount Vite middleware for development UI preview
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(path.posix.join('/'), (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`
🚀 Riyad Store API & Interactive Web Dashboard running on http://${HOST}:${PORT}
📌 API Base: http://${HOST}:${PORT}/api/store/list
    `);
  });
}

startServer();
