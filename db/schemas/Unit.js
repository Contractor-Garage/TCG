const mongoose = require('mongoose');
/**
 * Can be used as model for individual units or a summary of many units.
 */
const unitSchema = mongoose.Schema({
    // Unit number or designation
    unitName: String,
    // Monthly rent in dollar amount
    monthlyRent: Number,
    // Is this unit available
    available: Boolean,
    // Date this unit becomes available, stored as a plain YYYY-MM-DD calendar date.
    // Empty/absent means the unit is available now. Only meaningful when `available`
    // is true. Stored as a String rather than a Date on purpose: this is a calendar
    // date, not a moment in time, and a Date would be saved as UTC midnight and
    // render as the previous day for every US visitor. Dates in the past are treated
    // as "available now" at render time, so no cleanup job is needed.
    availableDate: String,
    // Width in feet
    width: Number,
    // Height in feet
    height: String,
    // Depth in feet
    depth: Number,
    // Square Footage
    squareFeet: Number,
    // Total number of this type of unit when using as summary
    numberOfUnitsByType: Number
});

module.exports = unitSchema;
