const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Contact = require('../models/Contact');

// POST submit contact form (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
        }
        
        await Contact.create({ name, email, subject, message });
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// GET all contacts (Protected)
router.get('/', protect, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        const mappedContacts = contacts.map(c => {
            const contact = c.toObject();
            contact.id = contact._id.toString();
            return contact;
        });
        res.json({ success: true, count: mappedContacts.length, data: mappedContacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PATCH mark contact as read (Protected)
router.patch('/:id/read', protect, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        const data = contact.toObject();
        data.id = data._id.toString();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update message status' });
    }
});

// DELETE contact (Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
});

module.exports = router;
