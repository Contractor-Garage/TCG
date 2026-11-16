/**
 * Test runner for the server: `npm test`.
 *
 * Starts a throwaway local MongoDB (data in the OS temp folder, deleted afterwards), runs every
 * `test/*.test.js` file with Node's built-in test runner, then shuts MongoDB down.
 * Nothing here touches the real database or Cloudinary, and no extra npm packages are needed.
 *
 * Settings (environment variables):
 *   MONGOD_PATH   path to mongod.exe (default: the MongoDB 4.2 install location on this laptop)
 *   TEST_DB_URI   use an already-running test database instead of starting one
 */
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

const MONGOD_PATH = process.env.MONGOD_PATH || 'C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongod.exe';

const freePort = () => new Promise((resolve, reject) => {
  const srv = net.createServer();
  srv.listen(0, '127.0.0.1', () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
  srv.on('error', reject);
});

const waitForPort = (port, timeoutMs) => new Promise((resolve, reject) => {
  const deadline = Date.now() + timeoutMs;
  const attempt = () => {
    const sock = net.connect(port, '127.0.0.1');
    sock.once('connect', () => { sock.end(); resolve(); });
    sock.once('error', () => {
      sock.destroy();
      if (Date.now() > deadline) reject(new Error(`MongoDB did not start on port ${port}`));
      else setTimeout(attempt, 250);
    });
  };
  attempt();
});

const runTests = (dbUri) => new Promise((resolve) => {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).map(f => path.join(__dirname, f));
  const child = spawn(process.execPath, ['--test', '--test-concurrency=1', ...files], {
    stdio: 'inherit',
    env: { ...process.env, TEST_DB_URI: dbUri }
  });
  child.on('exit', code => resolve(code === null ? 1 : code));
});

(async () => {
  if (process.env.TEST_DB_URI) {
    process.exit(await runTests(process.env.TEST_DB_URI));
  }
  if (!fs.existsSync(MONGOD_PATH)) {
    console.error(`mongod not found at ${MONGOD_PATH}. Set MONGOD_PATH or TEST_DB_URI.`);
    process.exit(1);
  }
  const port = await freePort();
  const dbPath = fs.mkdtempSync(path.join(os.tmpdir(), 'tcg-test-db-'));
  const mongod = spawn(MONGOD_PATH, ['--dbpath', dbPath, '--port', String(port), '--bind_ip', '127.0.0.1', '--wiredTigerCacheSizeGB', '0.25', '--quiet'], { stdio: 'ignore' });
  let code = 1;
  try {
    await waitForPort(port, 30000);
    code = await runTests(`mongodb://127.0.0.1:${port}/tcg_test`);
  } finally {
    mongod.kill();
    await new Promise(r => setTimeout(r, 1000));
    fs.rmSync(dbPath, { recursive: true, force: true });
  }
  process.exit(code);
})();
