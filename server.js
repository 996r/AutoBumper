const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);

server.use(auth);

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