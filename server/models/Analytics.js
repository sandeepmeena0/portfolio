const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    path: { type: String, required: true },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    device: { type: String, default: 'Unknown' },   // Mobile / Desktop / Tablet
    browser: { type: String, default: 'Unknown' },  // Chrome / Firefox / Safari etc
    os: { type: String, default: 'Unknown' },       // Windows / macOS / Android etc
    country: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
