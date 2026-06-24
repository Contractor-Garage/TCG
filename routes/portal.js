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
      res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    }
    if (user) {
      res.status(400).send('The requested username is already taken!!');
    }
    else {
      newUser.save(err => {
        if (err) {
          res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
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
      res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    }
    if (!user) {
      res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
    }
    else {
      return res.status(200).send('Delete successful');
    }
  });
});

router.put('/user/max-allowance/:id', isAdmin, (req, res) => {
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
      res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
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
      if (err.code === 11000 && err.codeName === 'DuplicateKey') {
        res.status(400).send('Current username value already in use, username must be unique. Choose another value!');
      }
      res.status(err.status ? error.status : 500).send(err.message ? err.message : 'There was a problem processing the request.');
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
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          res.status(error.status ? error.status : 500).send(error.message ? error.message : 'There was a problem processing the request.');
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
      res.status(error.status ? error.status : 500).send(error.message ? error.message : 'There was a problem processing the request.');
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

router.put('/location', (req, res, next) => {
  if (!req.body._id) {
    const err = new Error('_id field not found and is required for update operation.');
    err.status = 400;
    next(err);
    return
  }
  // If you are a normal user make sure location belongs to you before updating. Also check user's max location allowance if this is a publish operation.
  if (!req.session.user.isAdmin) {
    Location.findById(req.body._id)
    .then(location => {
      // If this location is not published and user is trying to publish first check there location allowance.
      let promise;
      if (!location.isPublished && req.body.isPublished) {
        promise = Location.count({createdBy: req.session.user._id, isPublished: true});
      }
      else {
        promise = new Promise((resolve, reject) => resolve());
      }
      promise.then(count => {
        if (count >= req.session.user.maxLocationAllowance) {
          res.status(401).send('Unable to publish location maximum location allowance has been reached.');
          return;
        }
        CloudinaryService.cleanupResourcesFromLocationUpdate(location, req);
        // Get location by id and check if it is created by the current user.
        Location.findOneAndUpdate({ _id: req.body._id, createdBy: req.session.user._id }, req.body, {new: true})
        .then(location => {
          if (!location) {
            res.status(401).send('You don\'t have access to this location!');
          }
          else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(location);
          }
        }, err => {
          console.log(err);
          if (err.code === 11000 && err.codeName === 'DuplicateKey') {
            res.status(400).send('Current value already in use, url slug must be unique. Choose another value!');
          }
          else {
            res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was an error processing this request.');
          }
        });
      })
      .catch(err => {
        res.status(err.status ? err.status : 500).send(err.message ? err.message : 'The was an error processing this request.');
      });
    })
    .catch(err => {
      res.status(err.status ? err.status : 500).send(err.message ? err.message : 'There was an error processing this request.');
    });
  }
  else {
    Location.findById(req.body._id)
    .then(location => {
      CloudinaryService.cleanupResourcesFromLocationUpdate(location, req);
      Location.findByIdAndUpdate(req.body._id, req.body, {new: true})
      .then(location => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(location);
      }, err => {
        console.log(err);
        if (err.code === 11000 && err.codeName === 'DuplicateKey') {
          res.status(400).send('Current value already in use, url slug must be unique. Choose another value!');
        }
        else {
          res.status(err.status).send(err.message);
        }
      });
    })
    .catch(err => {
      console.log('err :>> ', err);
      res.status(err.status).send(err.message);
    });
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
    // If below admin and location is not yours don't allow delete operation.
    if (!req.session.user.isAdmin && !location.createdBy.equals(req.session.user._id)) {
      res.status(401).send('Not authorized! Unable to delete this location!');
    }
    else {
      Location.findByIdAndDelete(req.params.id)
      .then(location => {
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
