const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Settings = require('../models/Settings');

// GET settings (Public)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // Create default settings if they don't exist
        if (!settings) {
            settings = await Settings.create({
                yearsExperience: 1,
                projectsBuilt: 10,
                technologies: 5,
                commits: 500,
                aboutHeading: "A passionate developer who loves turning ideas into reality",
                aboutText1: "I'm a MERN Stack Developer with a strong foundation in building full-stack web applications. I specialize in creating responsive, user-friendly interfaces with React and robust backend services with Node.js and Express.",
                aboutText2: "My journey in web development started with curiosity and has grown into a deep passion for crafting elegant solutions to complex problems. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies.",
                fresherText: "Aspiring Developer"
            });
        }
        
        const data = settings.toObject();
        data.id = data._id.toString();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update settings (Protected)
router.put('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        }
        
        const data = settings.toObject();
        data.id = data._id.toString();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
});

module.exports = router;
