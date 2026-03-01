const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// 1. Link the database to the auth module
// This is critical for /register and /login to work
server.db = router.db;

// 2. Set default middlewares (logger, static, cors, no-cache)
server.use(middlewares);

// 3. Add the auth middleware BEFORE the router
// This intercepts requests to /register and /login
server.use(auth);

// 4. Use the router for your data (categories, etc.)
server.use(router);

const PORT = 3001;
const HOST = '0.0.0.0'; // FORCE listening on the whole network

server.listen(PORT, HOST, () => {
  console.log('--------------------------------------------');
  console.log('🚀 JSON Server with Auth is RUNNING');
  console.log(`🏠 Local:   http://localhost:${PORT}`);
  console.log(`📱 Network: http://192.168.5.102:${PORT}`);
  console.log('--------------------------------------------');
  console.log('Test endpoints:');
  console.log(`POST -> http://192.168.5.102:${PORT}/register`);
  console.log(`POST -> http://192.168.5.102:${PORT}/login`);
  console.log('--------------------------------------------');
});