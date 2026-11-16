/**
 * Location routes: behavior that works today and must keep working.
 * Run with `npm test` (starts a throwaway MongoDB; never touches production or Cloudinary).
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const t = require('./helpers/testApp');

before(t.start);
after(t.stop);
beforeEach(t.reset);

test('creating a location saves it as a draft owned by the current user', async () => {
  const res = await t.request('POST', '/portal/location', { name: 'New Garage', slug: 'new-garage', coordinates: [1, 2], isDraft: true });
  assert.equal(res.status, 200);
  const saved = await t.Location.findById(res.body._id);
  assert.equal(saved.name, 'New Garage');
  assert.equal(saved.isDraft, true);
  assert.equal(String(saved.createdBy), String(t.ADMIN._id));
});

test('saving a location updates its fields', async () => {
  const loc = await t.makeLocation();
  const res = await t.request('PUT', '/portal/location', { _id: loc._id, name: 'Renamed', addressFirstLine: '1 Main St' });
  assert.equal(res.status, 200);
  const saved = await t.Location.findById(loc._id);
  assert.equal(saved.name, 'Renamed');
  assert.equal(saved.addressFirstLine, '1 Main St');
});

test('publishing a draft makes it visible on the public site', async () => {
  const loc = await t.makeLocation({ isDraft: true, isPublished: undefined });
  assert.equal((await t.request('GET', `/api/location/${loc.slug}`)).body, null);
  await t.request('PUT', '/portal/location', { _id: loc._id, isPublished: true, isDraft: false });
  const pub = await t.request('GET', `/api/location/${loc.slug}`);
  assert.equal(pub.body.name, 'Test Garage');
});

test('a slug already used by another location is rejected with 400', async () => {
  await t.makeLocation({ slug: 'taken' });
  const loc = await t.makeLocation();
  const res = await t.request('PUT', '/portal/location', { _id: loc._id, slug: 'taken' });
  assert.equal(res.status, 400);
});

test('hide removes a location from the public site', async () => {
  const loc = await t.makeLocation();
  const res = await t.request('POST', `/portal/location/hide/${loc._id}`);
  assert.equal(res.status, 200);
  assert.equal((await t.Location.findById(loc._id)).isPublished, false);
  const list = await t.request('GET', '/api/locations');
  assert.equal(list.body.length, 0);
});

test('coming soon can be set and cleared', async () => {
  const loc = await t.makeLocation();
  await t.request('POST', `/portal/location/coming-soon/${loc._id}`, { comingSoon: true });
  assert.equal((await t.Location.findById(loc._id)).comingSoon, true);
  await t.request('POST', `/portal/location/coming-soon/${loc._id}`, { comingSoon: false });
  assert.equal((await t.Location.findById(loc._id)).comingSoon, false);
});

test('deleting a location removes it', async () => {
  const loc = await t.makeLocation();
  const res = await t.request('DELETE', `/portal/location/${loc._id}`);
  assert.equal(res.status, 200);
  assert.equal(await t.Location.findById(loc._id), null);
});

test('the public list shows only published, non-draft locations', async () => {
  await t.makeLocation({ name: 'Live' });
  await t.makeLocation({ name: 'Draft', isDraft: true, isPublished: undefined });
  await t.makeLocation({ name: 'Hidden', isPublished: false });
  const list = await t.request('GET', '/api/locations');
  assert.deepEqual(list.body.map(l => l.name), ['Live']);
});

test('a regular user can save their own location but not someone else\'s', async () => {
  const mine = await t.makeLocation({ createdBy: t.OWNER._id });
  const theirs = await t.makeLocation({ createdBy: t.OTHER._id, name: 'Theirs' });
  t.actAs(t.OWNER);
  assert.equal((await t.request('PUT', '/portal/location', { _id: mine._id, name: 'Mine renamed' })).status, 200);
  assert.equal((await t.request('PUT', '/portal/location', { _id: theirs._id, name: 'Hijacked' })).status, 401);
  assert.equal((await t.Location.findById(theirs._id)).name, 'Theirs');
});

test('removing a gallery image deletes that file from Cloudinary', async () => {
  const loc = await t.makeLocation({ detailPageImages: [t.img('keep'), t.img('remove')] });
  await t.request('PUT', '/portal/location', { _id: loc._id, detailPageImages: [t.img('keep')] });
  assert.deepEqual(t.deletedIds('image'), ['TCG/remove']);
});

test('replacing the banner deletes the old banner file', async () => {
  const loc = await t.makeLocation({ bannerImage: t.img('old-banner') });
  await t.request('PUT', '/portal/location', { _id: loc._id, bannerImage: t.img('new-banner') });
  assert.deepEqual(t.deletedIds('image'), ['TCG/old-banner']);
});

test('removing a video deletes the video file and its poster', async () => {
  const loc = await t.makeLocation({ detailPageVideos: [t.video('tour', 'tour-poster')] });
  await t.request('PUT', '/portal/location', { _id: loc._id, detailPageVideos: [] });
  assert.deepEqual(t.deletedIds('video'), ['GARAGEVIDEOS/tour']);
  assert.ok(t.deletedIds('image').includes('TCG/tour-poster'));
});

test('a save that keeps every file deletes nothing', async () => {
  const loc = await t.makeLocation({ bannerImage: t.img('b'), thumbnailImage: t.img('t'), detailPageImages: [t.img('g')], detailPageVideos: [t.video('v', 'p')] });
  const fresh = (await t.Location.findById(loc._id)).toObject();
  await t.request('PUT', '/portal/location', { ...fresh, name: 'Unchanged media' });
  assert.equal(t.cloudinaryDeletes.length, 0);
});
