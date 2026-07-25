const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: 'fas fa-code' },
    tech: [{ type: String }],
    category: { type: String, required: true },
    live: { type: String },
    github: { type: String },
    image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
