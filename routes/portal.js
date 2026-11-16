var express = require('express');
const mongoose = require('mongoose');
const Location = require('../db/schemas/Location');
const Preview = require('../db/schemas/Preview');
var router = express.Router();
const User = require('../db/schemas/User');
const axios = require('axios');
const CloudinaryService = require('../services/cloudinaryService');

router.get('/', (req, res, next) => {
  res.send('respond with a protected resource');
});

/*
*          !!##########################!!
*          !!                          !!
*          !!          Users           !!
*          !!                          !!
*          !!##########################!!
*/

const isAdmin = (req, res, next) => {
  if (!req.session.user.isAdmin) {
    const err = new Error('Not authorized! Admin access required.');
    err.status = 401;
    return next(err);
  }
  next();
}

router.post('/user/create', isAdmin, (req, res) => {
  const newUser = new User({
    ...req.body,
    ...(req.body.isAdmin && {isSuperAdmin: false, maxLocationAllowance: 69420})
  });

  User.findOne({
    username: newUser.username
  }, (err, user) => {
    if (err) {
      res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    }
    if (user) {
      res.status(400).send('The requested username is already taken!!');
    }
    else {
      newUser.save(err => {
        if (err) {
          res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
        }
        return res.status(200).send();
      });
    }
  });
});

router.get('/user/get-all-users', isAdmin, (req, res, next) => {
  User.find({}, { password: 0 }, (err, users) => {
    if (err) {
      const err = new Error('Something went wrong!');
      err.status = 500;
      return next(err);
    }
    return res.status(200).send(users);
  });
});

router.delete('/user/:id', isAdmin, (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    }
    else if (!user) {
      // Already deleted (e.g. a double click). Previously this read a property of null and crashed the server.
      res.status(404).send('User not found.');
    }
    else {
      res.status(200).send('Delete successful');
    }
  });
});

router.put('/user/max-allowance/:id', isAdmin, (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
  }
  else {
    User.findByIdAndUpdate(req.params.id, {maxLocationAllowance: req.body.maxLocationAllowance})
    .then(user => {
      res.status(200).send('Updated Successfully!');
    })
    .catch(err => {
      res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    });
  }
});

/**
 * Updates basic user information like first name last name and username.
 * Also updates the user information for the current session.
 * Will send error if username is already taken in the system.
 */
router.put('/user/:id', (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
  }
  else if (req.params.id !== req.session.user._id) {
    const err = new Error('Cannot change data of another user.');
    err.status = 400;
    next(err);
  }
  else {
    User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => {
      req.session.user = {...req.session.user, ...req.body};
      res.status(200).send('User update successful');
    })
    .catch(err => {
      // Respond once only: answering twice threw inside this handler and crashed the server.
      if (err.code === 11000) {
        res.status(400).send('Current username value already in use, username must be unique. Choose another value!');
      }
      else {
        res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
      }
    });
  }
});

router.put('/user/change-password/:id', (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
  }
  else if (req.params.id !== req.session.user._id) {
    const err = new Error('Cannot change password of another user.');
    err.status = 400;
    next(err);
  }
  else if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d].{5,}$/.test(req.body.newPassword)) {
    res.status(400).send('Password does not meet requirements. Must be minimum 6 digits long with at least one capital letter one number.');
  }
  else {
    User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).send('User not found.');
        return;
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
        }
        else if (isMatch && isMatch === true) {
          user.password = req.body.newPassword;
          user.save();
          res.status(200).send('Password Update Successful.');
        }
        else if (!isMatch) {
          res.status(400).send('Password not recognized!');
        }
      });
    })
    .catch(err => {
      res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    });
  }
});
/*
*          !!##########################!!
*          !!                          !!
*          !!        Locations         !!
*          !!                          !!
*          !!##########################!!
*/

/**
 * Get all locations and drafts for a user. Super admin gets all drafts and information on whos draft it is.
 */
router.get('/locations', (req, res, next) => {
  let query;
  let popOptions = '';
  if (req.session.user.isSuperAdmin) {
    query = null;
    popOptions = 'createdBy';
  }
  else if (req.session.user.isAdmin) {
    query = { $or: [{ isDraft: false }, { createdBy: req.session.user._id }] };
    popOptions = 'createdBy';
  }
  else {
    query = { createdBy: req.session.user._id };
  }
  Location.find(query)
  .populate(popOptions, {password: 0})
  .then(locations => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(locations);
  })
  .catch(next)
});

/**
 * Get location from id. This is used when editing a draft location.
 */
 router.get('/location/:id', (req, res, next) => {
  Location.findById(req.params.id)
  .then(location => {
    if (!location) {
      res.status(404).send('No location found with that id!');
    }
    // If below super admin don't allow access to other people's drafts.
    else if (!req.session.user.isSuperAdmin && location.isDraft && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('Not authorized! Unable to edit a draft created by another user.');
    }
    // If below admin don't allow access to other people's records.
    else if (!req.session.user.isAdmin && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('You don\'t have access to this record!');
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(location);
    }
  })
  .catch(next);
});

router.post('/location', (req, res, next) => {
  Location.create({
    ...(req.body.name && {name: req.body.name}),
    ...(req.body.paypalEmail && {paypalEmail: req.body.paypalEmail}),
    ...(req.body.enablePayments && {enablePayments: req.body.enablePayments}),
    ...(req.body.paymentMarkupPercent && {paymentMarkupPercent: parseFloat(req.body.paymentMarkupPercent)}),
    ...(req.body.paymentMarkupFixed && {paymentMarkupFixed: parseFloat(req.body.paymentMarkupFixed)}),
    ...(req.body.coordinates && {coordinates: req.body.coordinates}),
    ...(req.body.slug && {slug: req.body.slug}),
    ...(req.body.addressFirstLine && {addressFirstLine: req.body.addressFirstLine}),
    ...(req.body.addressSecondLine && {addressSecondLine: req.body.addressSecondLine}),
    ...(req.body.thumbnailImage && {thumbnailImage: req.body.thumbnailImage}),
    ...(req.body.shortDescription && {shortDescription: req.body.shortDescription}),
    ...(req.body.longDescription && {longDescription: req.body.longDescription}),
    ...(req.body.detailPageImages && {detailPageImages: req.body.detailPageImages}),
    ...(req.body.features && {features: req.body.features}),
    ...(req.body.units && {units: req.body.units}),
    ...(req.body.unitSummary && {unitSummary: req.body.unitSummary}),
    ...(req.body.contactName && {contactName: req.body.contactName}),
    ...(req.body.contactEmail && {contactEmail: req.body.contactEmail}),
    ...(req.body.contactPhone && {contactPhone: req.body.contactPhone}),
    ...(req.body.bannerImage && {bannerImage: req.body.bannerImage}),
    ...(req.body.extras && {extras: req.body.extras}),
    ...(req.body.availabilityNote && {availabilityNote: req.body.availabilityNote}),
    ...(req.body.isDraft && {isDraft: true}),
    ...(req.body.isPublished && {isPublished: false}),
    createdBy: req.session.user._id
  })
  .then(location => {
    console.log('location created :>> ', location);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(location);
  })
  .catch(error => {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).send('Current value already in use, url slug must be unique. Choose another value!');
    }
    else {
      res.status(error.status ? error.status : 500).send(error.message ? error.message : 'There was a problem processing the request.');
    }
  });
});

/** A media link is only kept if it points at a finished upload (not a browser-only blob: preview). */
const isUploaded = url => typeof url === 'string' && url.startsWith('https://');

/**
 * Turns a save request into the fields a save may change.
 * - Status flags the portal may hold stale copies of are ignored: comingSoon has its own endpoint,
 *   and only creating a location makes a draft (isDraft:true). Ownership and ids can't change.
 * - Media that never finished uploading never replaces what is stored.
 */
const sanitizeLocationUpdate = (body, stored) => {
  const update = { ...body };
  // Only plain field names: update operators ($set...) and dotted paths would slip past these checks.
  Object.keys(update).forEach(key => { if (key.startsWith('$') || key.includes('.')) delete update[key]; });
  ['_id', '__v', 'createdBy', 'comingSoon'].forEach(key => delete update[key]);
  if (update.isDraft === true) delete update.isDraft;

  ['thumbnailImage', 'bannerImage'].forEach(key => {
    if (update[key] && !isUploaded(update[key].src)) delete update[key];
  });
  if (Array.isArray(update.detailPageImages)) {
    update.detailPageImages = update.detailPageImages.filter(image => image && isUploaded(image.src));
  }
  if (Array.isArray(update.detailPageVideos)) {
    const storedVideos = (stored.detailPageVideos || []).map(video => video.toObject ? video.toObject() : video);
    update.detailPageVideos = update.detailPageVideos
      .filter(video => video && isUploaded(video.src))
      .map(video => {
        if (video.poster === undefined || video.poster === null || isUploaded(video.poster)) return video;
        const match = storedVideos.find(s => (video._id && String(s._id) === String(video._id)) || s.src === video.src);
        const { poster, ...rest } = video;
        return match && match.poster ? { ...rest, poster: match.poster } : rest;
      });
  }
  return update;
};

router.put('/location', async (req, res) => {
  if (!req.body._id) {
    res.status(400).send('_id field not found and is required for update operation.');
    return;
  }
  try {
    const user = req.session.user;
    const location = await Location.findById(req.body._id);
    if (!location) {
      res.status(404).send('No location found with that id!');
      return;
    }
    // Regular users may only change their own locations.
    if (!user.isAdmin && !location.createdBy.equals(user._id)) {
      res.status(401).send('You don\'t have access to this location!');
      return;
    }
    // A regular user publishing a location must be within their location allowance.
    if (!user.isAdmin && !location.isPublished && req.body.isPublished) {
      const count = await Location.countDocuments({ createdBy: user._id, isPublished: true });
      if (count >= user.maxLocationAllowance) {
        res.status(401).send('Unable to publish location maximum location allowance has been reached.');
        return;
      }
    }
    const filter = user.isAdmin ? { _id: location._id } : { _id: location._id, createdBy: user._id };
    const update = sanitizeLocationUpdate(req.body, location);
    const updated = await Location.findOneAndUpdate(filter, update, { new: true });
    if (!updated) {
      res.status(401).send('You don\'t have access to this location!');
      return;
    }
    // Only now that the change is saved, delete files the location no longer uses.
    // A thumbnail or banner cleared with null is not deleted yet: older portal builds can send a stale
    // null, so that file stays in Cloudinary (re-attachable) until the portal fix is live.
    const keepUrls = ['thumbnailImage', 'bannerImage']
      .filter(key => update[key] === null && location[key] && location[key].src)
      .map(key => location[key].src);
    CloudinaryService.cleanupRemovedMedia(location, updated, { keepUrls });
    res.status(200).json(updated);
  }
  catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).send('Current value already in use, url slug must be unique. Choose another value!');
    }
    else {
      res.status(err.status || 500).send(err.message || 'There was an error processing this request.');
    }
  }
});

router.post('/location/preview', (req, res, next) => {
  Preview.create(req.body)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(error => next(error));
});

router.post('/location/hide/:id', (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
    return
  }
  Location.findById(req.params.id)
  .then(location => {
    // If below admin and location is not yours don't allow hide operation.
    if (!req.session.user.isAdmin && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('Not authorized! Unable to hide this location!');
    }
    else {
      Location.findByIdAndUpdate(req.params.id, {isPublished: false})
      .then(location => {
        res.status(200).send('Update Successful');
      })
      .catch(err => {
        res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem updating this location.');
      });
    }
  })
  .catch(err => {
    res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem updating this location.');
  });
});

// Set/clear the "coming soon" flag for a location. Body: { comingSoon: boolean }.
// Used by the admin portal (separate v2 repo) to mark a location as coming soon.
router.post('/location/coming-soon/:id', (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
    return
  }
  Location.findById(req.params.id)
  .then(location => {
    // If below admin and location is not yours don't allow this operation.
    if (!req.session.user.isAdmin && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('Not authorized! Unable to update this location!');
    }
    else {
      Location.findByIdAndUpdate(req.params.id, { comingSoon: !!req.body.comingSoon }, { new: true })
      .then(updated => {
        res.status(200).json({ _id: updated._id, comingSoon: updated.comingSoon });
      })
      .catch(err => {
        res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem updating this location.');
      });
    }
  })
  .catch(err => {
    res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem updating this location.');
  });
});

router.delete('/location/:id', (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
    return
  }
  Location.findById(req.params.id)
  .then(location => {
    if (!location) {
      res.status(404).send('No location found with that id!');
    }
    // If below admin and location is not yours don't allow delete operation.
    else if (!req.session.user.isAdmin && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('Not authorized! Unable to delete this location!');
    }
    else {
      Location.findByIdAndDelete(req.params.id)
      .then(deleted => {
        // The location is gone, so its images and videos (unless another location uses them) go too.
        if (deleted) CloudinaryService.cleanupRemovedMedia(deleted, null);
        res.status(200).send('Location Deleted.');
      })
      .catch(err => {
        res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem deleting this location.');
      });
    }
  })
  .catch(err => {
    res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was a problem deleting this location.');
  });
});
/*
*          !!#########################!!
*          !!                         !!
*          !!         Images          !!
*          !!                         !!
*          !!#########################!!
*/

router.get('/image-upload-credentials', (req, res, next) => {
  return res.status(200).send({
    UPLOAD_PRESET: process.env.UPLOAD_PRESET,
    VIDEO_UPLOAD_PRESET: process.env.VIDEO_UPLOAD_PRESET,
    API_KEY: process.env.API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME
  });
});

module.exports = router;
