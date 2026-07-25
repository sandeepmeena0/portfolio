const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    path: { type: String, required: true },
    referrer: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
