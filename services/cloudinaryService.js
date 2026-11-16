const axios = require('axios');
const Location = require('../db/schemas/Location');

// Only files in these Cloudinary folders belong to locations. Nothing else is ever deleted.
const MEDIA_FOLDERS = ['TCG/', 'GARAGEVIDEOS/'];
// Website files that live in those folders. Never deleted, whatever a location record says.
const PROTECTED_IDS = ['GARAGEVIDEOS/WhatIsContractors', 'TCG/poster', 'TCG/courseSneakPeak'];

/** Every media URL a location uses: thumbnail, banner, gallery images and videos with posters. */
const mediaUrls = (location) => {
    if (!location) return [];
    const loc = typeof location.toObject === 'function' ? location.toObject() : location;
    const urls = [];
    const add = (url) => { if (typeof url === 'string' && url) urls.push(url); };
    if (loc.thumbnailImage) add(loc.thumbnailImage.src);
    if (loc.bannerImage) add(loc.bannerImage.src);
    (loc.detailPageImages || []).forEach(image => { if (image) { add(image.src); add(image.thumbnail); } });
    (loc.detailPageVideos || []).forEach(video => { if (video) { add(video.src); add(video.poster); } });
    return urls;
};

/**
 * Turns a Cloudinary delivery URL into { type, publicId }, e.g.
 * https://res.cloudinary.com/<cloud>/image/upload/v123/TCG/abc.jpg -> { type: 'image', publicId: 'TCG/abc' }.
 * Returns null for anything that isn't a Cloudinary file in a location media folder.
 */
const toAsset = (url) => {
    const match = /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(.+)$/.exec(url);
    if (!match) return null;
    const segments = match[2].split('?')[0].split('/');
    // Drop transformation and version segments that come before the public id.
    while (segments.length > 1 && (/^v\d+$/.test(segments[0]) || segments[0].includes(',') || /^[a-z]{1,3}_[^/]+$/.test(segments[0]))) {
        segments.shift();
    }
    const publicId = segments.join('/').replace(/\.[A-Za-z0-9]+$/, '');
    if (!MEDIA_FOLDERS.some(folder => publicId.startsWith(folder))) return null;
    if (PROTECTED_IDS.includes(publicId)) return null;
    return { type: match[1], publicId };
};

const deleteFromCloudinary = async (type, publicIds) => {
    // The Admin API accepts up to 100 ids per call. `invalidate` also clears the CDN copy.
    for (let i = 0; i < publicIds.length; i += 100) {
        const batch = publicIds.slice(i, i + 100);
        const query = batch.map(id => 'public_ids[]=' + encodeURIComponent(id)).join('&') + '&invalidate=true';
        await axios.delete(`https://${process.env.API_KEY}:${process.env.API_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/${type}/upload?${query}`, { timeout: 15000 });
        console.log(`Cloudinary: deleted ${type} files`, batch);
    }
};

/**
 * Deletes files a location stopped using. Call it only AFTER the change has been saved.
 *   before: the location as it was stored before the change
 *   after:  the location as stored now, or null when the location itself was deleted
 *   keepUrls: links that must not be deleted this time
 * Files are compared by Cloudinary id, not link, so one file reached by two links counts once.
 * A file is kept if the location still uses it anywhere (e.g. a gallery photo moved to the banner)
 * or if any other location uses it. Never throws: a failed cleanup must not fail the save.
 */
let cleanupsRunning = 0;

const assetKey = asset => `${asset.type}:${asset.publicId}`;

const cleanupRemovedMedia = async (before, after, { keepUrls = [] } = {}) => {
    cleanupsRunning++;
    try {
        const keys = urls => new Set(urls.map(toAsset).filter(Boolean).map(assetKey));
        const stillUsed = keys([...mediaUrls(after), ...keepUrls]);
        const removed = [...keys(mediaUrls(before))].filter(key => !stillUsed.has(key));
        if (removed.length === 0) return;

        // There are only a few dozen locations, so check every other one for the same files.
        const others = await Location.find({ _id: { $ne: before._id } }, 'thumbnailImage bannerImage detailPageImages detailPageVideos');
        others.forEach(other => keys(mediaUrls(other)).forEach(key => stillUsed.add(key)));

        const byType = { image: [], video: [] };
        removed.filter(key => !stillUsed.has(key)).forEach(key => {
            const [type, ...rest] = key.split(':');
            byType[type].push(rest.join(':'));
        });
        for (const type of ['image', 'video']) {
            if (byType[type].length > 0) await deleteFromCloudinary(type, byType[type]);
        }
    }
    catch (err) {
        console.log('Cloudinary cleanup failed:', err.message);
    }
    finally {
        cleanupsRunning--;
    }
};

/** Resolves once no cleanup is running. Used by tests; routes never wait on cleanup. */
const cleanupIdle = async () => {
    while (cleanupsRunning > 0) await new Promise(resolve => setTimeout(resolve, 10));
};

module.exports = {
    cleanupRemovedMedia,
    cleanupIdle,
    mediaUrls,
    toAsset
};
