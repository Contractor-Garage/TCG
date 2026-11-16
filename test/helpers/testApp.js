/**
 * Shared setup for server route tests.
 *
 * - Connects Mongoose to the throwaway test database started by test/run.js.
 * - Mounts the real /portal and /api routers on a bare Express app with a fake login session,
 *   so tests can act as an admin or a regular user.
 * - Replaces axios.delete (used only for Cloudinary deletes) with a recorder, so tests can see
 *   exactly which files the server would delete without ever calling Cloudinary.
 */
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

if (!/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(process.env.TEST_DB_URI || '')) {
  throw new Error('TEST_DB_URI must point at a local test database. Run tests with `npm test`.');
}

// Fake Cloudinary settings: deletes are recorded, never sent.
process.env.API_KEY = 'test-key';
process.env.API_SECRET = 'test-secret';
process.env.CLOUD_NAME = 'test-cloud';
const cloudinaryDeletes = [];
axios.delete = async (url) => { cloudinaryDeletes.push(url); return { status: 200, data: {} }; };

/** Public ids (e.g. "TCG/abc") the server asked Cloudinary to delete, by resource type. */
const deletedIds = (type = 'image') => cloudinaryDeletes
  .filter(u => u.includes(`/resources/${type}/upload?`))
  .flatMap(u => u.split('?')[1].split('&').map(p => decodeURIComponent(p.replace('public_ids[]=', ''))));

const Location = require('../../db/schemas/Location');
const User = require('../../db/schemas/User');
const portalRouter = require('../../routes/portal');
const apiRouter = require('../../routes/api');

const ADMIN = { _id: new mongoose.Types.ObjectId(), isAdmin: true, isSuperAdmin: true, username: 'admin' };
const OWNER = { _id: new mongoose.Types.ObjectId(), isAdmin: false, isSuperAdmin: false, maxLocationAllowance: 5, username: 'owner' };
const OTHER = { _id: new mongoose.Types.ObjectId(), isAdmin: false, isSuperAdmin: false, maxLocationAllowance: 5, username: 'other' };

let currentUser = ADMIN;
const actAs = (user) => { currentUser = user; };

let server;
let base;

const start = async () => {
  await mongoose.connect(process.env.TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
  await Location.init(); // build the unique slug index so duplicate-slug behavior matches production
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.session = { user: currentUser }; next(); });
  app.use('/api', apiRouter);
  app.use('/portal', portalRouter);
  app.use((err, req, res, next) => res.status(err.status || 500).send(err.message));
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
};

const stop = async () => {
  server && server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};

const reset = async () => {
  await Location.deleteMany({});
  cloudinaryDeletes.length = 0;
  actAs(ADMIN);
};

/** Sends a request and returns { status, body }. Never hangs: gives up after 5 seconds. */
const request = async (method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(5000)
  });
  const text = await res.text();
  let parsed = text;
  try { parsed = JSON.parse(text); } catch (e) { /* plain text response */ }
  return { status: res.status, body: parsed };
};

const img = (id) => ({ src: `https://res.cloudinary.com/test-cloud/image/upload/v1/TCG/${id}.jpg`, thumbnail: `https://res.cloudinary.com/test-cloud/image/upload/v1/TCG/${id}.jpg`, alt: id });
const video = (id, posterId) => ({ src: `https://res.cloudinary.com/test-cloud/video/upload/v1/GARAGEVIDEOS/${id}.mp4`, ...(posterId && { poster: `https://res.cloudinary.com/test-cloud/image/upload/v1/TCG/${posterId}.jpg` }) });

const makeLocation = (overrides = {}) => Location.create({
  name: 'Test Garage',
  slug: 'test-garage-' + Math.random().toString(36).slice(2, 8),
  coordinates: [38.88, -94.81],
  isDraft: false,
  isPublished: true,
  createdBy: ADMIN._id,
  ...overrides
});

module.exports = { start, stop, reset, request, actAs, ADMIN, OWNER, OTHER, Location, User, makeLocation, img, video, deletedIds, cloudinaryDeletes };
