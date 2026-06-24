const mongoose = require('mongoose');
const unitSchema = require('./Unit');
const imageSchema = require('./Image');
const videoSchema = require('./Video');
const extraSchema = require('./Extra');

const locationSchema = mongoose.Schema({
    // Primary display name
    name: String,
    // Email associated with the account payments will be sent to if PayPal is enabled.
    paypalEmail: String,
    // If true will display a PayPal button on location page and will use associated PayPal Email
    enablePayments: Boolean,
    // Payment percentage expressed as a decimal. Example 2.9% is .029
    paymentMarkupPercent: Number,
    // Payment fixed price per transaction markup express as dollars and cents. Example 30 cents is .30
    paymentMarkupFixed: Number,
    // Latitude and longitude points where this location will be marked on the map. Example [39.0175412, -94.7569592]
    coordinates: [Number],
    // Url slug that will load this record. (Must be unique)
    slug: {
        type: String,
        unique: true
    },
    // First line of the display address
    addressFirstLine: String,
    // Second line of the display address
    addressSecondLine: String,
    // Address of thumbnail image
    thumbnailImage: imageSchema,
    // A short description to be shown on the map popover
    shortDescription: {
        type: String,
        maxLength: 140
    },
    // A long description to show on the detail page
    longDescription: String,
    // Location images to show on the detail page
    detailPageImages: [imageSchema],
    // Location videos to show on the detail page
    detailPageVideos: [videoSchema],
    // List of features to show on detail page
    features: [String],
    // Unit information
    units: [unitSchema],
    // Summary of units
    unitSummary: [unitSchema],
    // Contact name
    contactName: String,
    // Contact email
    contactEmail: String,
    // Contact phone number
    contactPhone: String,
    // Optional banner image for detail page
    bannerImage: imageSchema,
    // Pricing extras additional to unit rental
    extras: [extraSchema],
    // Flag to check if this record is a draft
    isDraft: Boolean,
    // Flag to check if this location is published
    isPublished: Boolean,
    // Flag to mark this location as "coming soon" — takes precedence over the
    // availability-derived status (Available/Full) on the public site.
    comingSoon: Boolean,
    // The user who created this record
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;