var express = require('express');
var router = express.Router();
const Location = require('../db/schemas/Location');
const Preview = require('../db/schemas/Preview');
const User = require('../db/schemas/User');
const { transporter } = require('../services/mailer');
const { verifyTurnstile } = require('../services/turnstile');
const { buildSeminarSignupEmail, buildContactEmail } = require('../services/emailTemplates');

/*
*          !!##########################!!
*          !!                          !!
*          !!          Users           !!
*          !!                          !!
*          !!##########################!!
*/

router.post('/user/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Something went wrong!', err);
    }
    if (!user) return res.status(404).send('Username not found!');
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(401).send('Invalid password!');
      }
      if (isMatch && isMatch === true) {
        req.session.user = user;
        return res.status(200).send(req.session.user);
      }
      else if (!isMatch) {
        return res.status(401).send('Invalid password!');
      }
    });
  });
});

router.post('/user/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send();
});

router.get('/user/is-logged-in', (req, res, next) => {
  if (req.session.user) {
    const response = {...req.session.user};
    delete response.password;
    res.status(200).send(response);
  }
  else {
    res.status(401).send('You are not logged in!');
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
 * Get all published, non-draft locations for the public site (excludes drafts
 * and hidden/unpublished locations; coming-soon locations are published, so
 * they remain included).
 */
router.get('/locations', (req, res, next) => {
  Location.find({ isDraft: false, isPublished: true })
  .then(locations => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(locations);
  })
  .catch(next)
});

/**
 * Get a published, non-draft location by slug (hidden/draft locations are not
 * served publicly; admin previews use /location/preview/:id).
 */
router.get('/location/:slug', (req, res, next) => {
  Location.findOne({ slug: req.params.slug, isDraft: false, isPublished: true })
  .then(location => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(location);
  })
  .catch(next);
});

router.get('/location/preview/:id', (req, res, next) => {
  Preview.findById(req.params.id)
  .then(location => {
    console.log(location);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(location);
  })
  .catch(next);
});

/*
*          !!##########################!!
*          !!                          !!
*          !!          Email           !!
*          !!                          !!
*          !!##########################!!
*/

/**
 * Options for the contact form's "I'm Interested In" dropdown. Must match the
 * options in client-new/src/pages/BrandWithUs.jsx.
 */
const CONTACT_INTERESTS = [
  'Brand Subscription',
  'Development Consulting',
  'Turn-Key Development',
  'Not sure yet',
];

/** Field rules per form: { name: { required, max, oneOf } }. */
const SEMINAR_FIELDS = {
  fullname: { required: true, max: 200 },
  email: { required: true, max: 254 },
  phoneNumber: { required: true, max: 50 },
  attendanceType: { oneOf: ['In-Person', 'Webinar'] },
  company: { max: 200 },
  jobTitle: { max: 200 },
  specialRequests: { max: 200 },
  hearAboutUs: { max: 500 },
};

const CONTACT_FIELDS = {
  name: { required: true, max: 200 },
  email: { required: true, max: 254 },
  market: { required: true, max: 200 },
  message: { max: 5000 },
  interest: { oneOf: CONTACT_INTERESTS },
};

/**
 * True when every field matches its rule: a string within its length limit (or
 * absent/empty when optional), one of the allowed values where listed, and `email`
 * shaped like an address. The forms already enforce all of this, so a failure means
 * a hand-built request rather than a real visitor.
 */
function hasValidFields(body, fields) {
  if (!/^[^\s@]+@[^\s@]+$/.test(body.email || '')) return false;
  return Object.entries(fields).every(([name, rule]) => {
    const value = body[name];
    if (value === undefined || value === '') return !rule.required;
    if (typeof value !== 'string') return false;
    if (rule.required && value.trim() === '') return false;
    if (rule.max && value.length > rule.max) return false;
    return !rule.oneOf || rule.oneOf.includes(value);
  });
}

/**
 * Spam screening shared by the public forms. Resolves true when the submission
 * should be emailed; otherwise the response has already been sent and the
 * submission is dropped — caught spam is never stored or emailed.
 *  1. Honeypot: the hidden "website" field is filled. Answer with a normal success
 *     so the bot has nothing to learn from.
 *  2. Field check: missing, oversized, or unexpected values (400).
 *  3. Cloudflare Turnstile: the widget token must verify. 403 lets the form tell a
 *     real visitor that verification failed and to try again.
 */
async function passesSpamChecks(req, res, fields) {
  const body = req.body || {};
  if (body.website) {
    res.status(200).send();
    return false;
  }
  if (!hasValidFields(body, fields)) {
    res.status(400).send('Invalid submission');
    return false;
  }
  if (!(await verifyTurnstile(body.turnstileToken))) {
    res.status(403).send('Verification failed');
    return false;
  }
  return true;
}

/**
 * Handle the sign up form submission and email.
 */
router.post('/seminar/sign-up', async (req, res, next) => {
  if (!(await passesSpamChecks(req, res, SEMINAR_FIELDS))) return;

  const emailHtml = buildSeminarSignupEmail(req.body);

  transporter.sendMail({
    from: '"Contractor Garage Website" <webmaster@contractorgarage.com>',
    to: [
      'kevin.combs@contractorgarage.com',
      'kcombs@insightcommercial.net',
    ],
    bcc: [
      'aaron.mcnulty@contractorgarage.com',
      'amcnulty88@swbell.net',
    ],
    subject: 'New Seminar Signup',
    html: emailHtml,
  }).then(() => {
    res.status(200).send();
  }).catch(next);
})

router.post('/contact', async (req, res, next) => {
  if (!(await passesSpamChecks(req, res, CONTACT_FIELDS))) return;

  const emailHtml = buildContactEmail(req.body);
  // The interest was checked against CONTACT_INTERESTS, so it is safe in the subject.
  const subject = req.body.interest
    ? `New Contact Form Submission — ${req.body.interest}`
    : 'New Contact Form Submission';

  transporter.sendMail({
    from: '"Contractor Garage Website" <webmaster@contractorgarage.com>',
    to: [
      'kevin.combs@contractorgarage.com',
      'kcombs@insightcommercial.net',
    ],
    bcc: [
      'aaron.mcnulty@contractorgarage.com',
      'amcnulty88@swbell.net',
    ],
    subject,
    html: emailHtml,
  }).then(() => {
    res.status(200).send();
  }).catch(next);
})

module.exports = router;
