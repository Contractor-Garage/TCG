/**
 * Phase 1 server guards. Each test names the bug (B#) from the location editor review it covers.
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const t = require('./helpers/testApp');

before(t.start);
after(t.stop);
beforeEach(t.reset);

const serverStillUp = async () => assert.equal((await t.request('GET', '/api/locations')).status, 200);

test('B2: an admin save with bad data fails cleanly instead of crashing the server', async () => {
  const loc = await t.makeLocation();
  const res = await t.request('PUT', '/portal/location', { _id: loc._id, coordinates: ['not-a-number'] });
  assert.ok(res.status >= 400 && res.status < 600, `status ${res.status}`);
  await serverStillUp();
});

test('B2: saving a location that no longer exists returns 404 instead of crashing', async () => {
  const res = await t.request('PUT', '/portal/location', { _id: '64e2e0000000000000000999', name: 'Ghost' });
  assert.equal(res.status, 404);
  await serverStillUp();
});

test('B2: a stored file link the cleanup cannot read does not break saving', async () => {
  const loc = await t.makeLocation({ bannerImage: { src: 'https://example.com/not-cloudinary.jpg', alt: 'x' } });
  const res = await t.request('PUT', '/portal/location', { _id: loc._id, bannerImage: t.img('new-banner') });
  assert.equal(res.status, 200);
  assert.equal(t.cloudinaryDeletes.length, 0);
  await serverStillUp();
});

test('B5: when a save fails (slug taken), no files are deleted', async () => {
  await t.makeLocation({ slug: 'taken' });
  const loc = await t.makeLocation({ detailPageImages: [t.img('keep-me')] });
  const res = await t.request('PUT', '/portal/location', { _id: loc._id, slug: 'taken', detailPageImages: [] });
  assert.equal(res.status, 400);
  assert.equal(t.cloudinaryDeletes.length, 0);
  assert.equal((await t.Location.findById(loc._id)).detailPageImages.length, 1);
});

test('B5: a regular user cannot delete another owner\'s files', async () => {
  const theirs = await t.makeLocation({ createdBy: t.OTHER._id, detailPageImages: [t.img('their-photo')], detailPageVideos: [t.video('their-video', 'their-poster')] });
  t.actAs(t.OWNER);
  const res = await t.request('PUT', '/portal/location', { _id: theirs._id, detailPageImages: [], detailPageVideos: [] });
  assert.equal(res.status, 401);
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('B1 backstop: a save carrying a stale isDraft:true does not hide a published location', async () => {
  const loc = await t.makeLocation();
  await t.request('PUT', '/portal/location', { _id: loc._id, name: 'Still live', isDraft: true, isPublished: true });
  const saved = await t.Location.findById(loc._id);
  assert.equal(saved.isDraft, false);
  assert.equal(saved.name, 'Still live');
});

test('B6 backstop: a save carrying a stale comingSoon value does not change it', async () => {
  const loc = await t.makeLocation({ comingSoon: false });
  await t.request('PUT', '/portal/location', { _id: loc._id, comingSoon: true });
  assert.equal((await t.Location.findById(loc._id)).comingSoon, false);
});

test('a save cannot change who owns a location', async () => {
  const loc = await t.makeLocation({ createdBy: t.OWNER._id });
  await t.request('PUT', '/portal/location', { _id: loc._id, createdBy: t.OTHER._id });
  assert.equal(String((await t.Location.findById(loc._id)).createdBy), String(t.OWNER._id));
});

test('B4 backstop: a poster that never finished uploading (blob: link) keeps the stored poster', async () => {
  const loc = await t.makeLocation({ detailPageVideos: [t.video('tour', 'real-poster')] });
  const stored = (await t.Location.findById(loc._id)).toObject().detailPageVideos[0];
  await t.request('PUT', '/portal/location', { _id: loc._id, detailPageVideos: [{ _id: stored._id, src: stored.src, poster: 'blob:https://portal.contractorgarage.com/1234' }] });
  assert.equal((await t.Location.findById(loc._id)).detailPageVideos[0].poster, stored.poster);
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('B9: a new location keeps its availability note', async () => {
  const res = await t.request('POST', '/portal/location', { name: 'With note', slug: 'with-note', isDraft: true, availabilityNote: 'Early bird lease-up sale' });
  assert.equal((await t.Location.findById(res.body._id)).availabilityNote, 'Early bird lease-up sale');
});

test('B14: deleting a location deletes its images and videos', async () => {
  const loc = await t.makeLocation({ thumbnailImage: t.img('thumb'), bannerImage: t.img('banner'), detailPageImages: [t.img('g1')], detailPageVideos: [t.video('v1', 'p1')] });
  assert.equal((await t.request('DELETE', `/portal/location/${loc._id}`)).status, 200);
  assert.deepEqual(t.deletedIds('image').sort(), ['TCG/banner', 'TCG/g1', 'TCG/p1', 'TCG/thumb']);
  assert.deepEqual(t.deletedIds('video'), ['GARAGEVIDEOS/v1']);
});

test('B14: deleting a location keeps files another location still uses', async () => {
  await t.makeLocation({ detailPageImages: [t.img('shared')] });
  const loc = await t.makeLocation({ detailPageImages: [t.img('shared'), t.img('only-mine')] });
  await t.request('DELETE', `/portal/location/${loc._id}`);
  assert.deepEqual(t.deletedIds('image'), ['TCG/only-mine']);
});

test('B15 (held back until the portal fix is live): clearing the banner or thumbnail keeps the file for now', async () => {
  const loc = await t.makeLocation({ bannerImage: t.img('old-banner'), thumbnailImage: t.img('old-thumb') });
  await t.request('PUT', '/portal/location', { _id: loc._id, bannerImage: null, thumbnailImage: null });
  const saved = await t.Location.findById(loc._id);
  assert.equal(saved.bannerImage, null);
  assert.equal(saved.thumbnailImage, null);
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('a file moved from the gallery to the banner is not deleted', async () => {
  const loc = await t.makeLocation({ detailPageImages: [t.img('photo')] });
  await t.request('PUT', '/portal/location', { _id: loc._id, detailPageImages: [], bannerImage: t.img('photo') });
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('only files in the location media folders are ever deleted', async () => {
  const outside = { src: 'https://res.cloudinary.com/test-cloud/image/upload/v1/website/hero.jpg', alt: 'site asset' };
  const loc = await t.makeLocation({ bannerImage: outside });
  await t.request('PUT', '/portal/location', { _id: loc._id, bannerImage: null });
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('update operators and dotted paths in a save request are ignored', async () => {
  const loc = await t.makeLocation({ createdBy: t.OWNER._id, comingSoon: false });
  t.actAs(t.OWNER);
  await t.request('PUT', '/portal/location', { _id: loc._id, $set: { comingSoon: true, isPublished: false }, 'bannerImage.src': 'blob:x' });
  const saved = await t.Location.findById(loc._id);
  assert.equal(saved.comingSoon, false);
  assert.equal(saved.isPublished, true);
});

test('one file reached by two different links is not deleted while still used', async () => {
  const thumbLink = 'https://res.cloudinary.com/test-cloud/image/upload/c_thumb,w_200/v1/TCG/p.jpg';
  const loc = await t.makeLocation({ detailPageImages: [{ src: thumbLink, thumbnail: thumbLink, alt: 'p' }] });
  await t.request('PUT', '/portal/location', { _id: loc._id, detailPageImages: [], bannerImage: t.img('p') });
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('website files kept in the media folders are never deleted', async () => {
  const site = { src: 'https://res.cloudinary.com/test-cloud/video/upload/v1697497123/GARAGEVIDEOS/WhatIsContractors.mp4' };
  const loc = await t.makeLocation({ detailPageVideos: [site] });
  await t.request('DELETE', `/portal/location/${loc._id}`);
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test("a regular user cannot delete someone else's location or its files", async () => {
  const theirs = await t.makeLocation({ createdBy: t.OTHER._id, detailPageImages: [t.img('theirs')] });
  t.actAs(t.OWNER);
  assert.equal((await t.request('DELETE', `/portal/location/${theirs._id}`)).status, 401);
  assert.notEqual(await t.Location.findById(theirs._id), null);
  assert.equal(t.cloudinaryDeletes.length, 0);
});

test('a regular user at their location allowance cannot publish another', async () => {
  await t.makeLocation({ createdBy: t.OWNER._id });
  const draft = await t.makeLocation({ createdBy: t.OWNER._id, isDraft: true, isPublished: undefined });
  t.actAs({ ...t.OWNER, maxLocationAllowance: 1 });
  const res = await t.request('PUT', '/portal/location', { _id: draft._id, isPublished: true, isDraft: false });
  assert.equal(res.status, 401);
  assert.notEqual((await t.Location.findById(draft._id)).isPublished, true);
});

test('B2: deleting a user who is already gone returns 404 instead of crashing', async () => {
  const user = await t.User.create({ username: 'gone-user', password: 'Secret123', isAdmin: false });
  assert.equal((await t.request('DELETE', `/portal/user/${user._id}`)).status, 200);
  assert.equal((await t.request('DELETE', `/portal/user/${user._id}`)).status, 404);
  await serverStillUp();
});

test('B2: changing to a username that is taken returns 400 instead of crashing', async () => {
  await t.User.init();
  await t.User.create({ username: 'taken-name', password: 'Secret123' });
  const me = await t.User.create({ username: 'my-name', password: 'Secret123' });
  t.actAs({ _id: String(me._id), isAdmin: false, username: 'my-name' });
  const res = await t.request('PUT', `/portal/user/${me._id}`, { username: 'taken-name' });
  assert.equal(res.status, 400);
  await serverStillUp();
});
