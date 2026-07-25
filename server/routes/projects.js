const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Project = require('../models/Project');

// GET all projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility
        const mappedProjects = projects.map(p => {
            const proj = p.toObject();
            proj.id = proj._id.toString();
            return proj;
        });
        res.json({ success: true, count: mappedProjects.length, data: mappedProjects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET single project (Public)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const projData = project.toObject();
        projData.id = projData._id.toString();
        res.json({ success: true, data: projData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST add new project (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const { id, _id, ...projectData } = req.body;
        const project = await Project.create(projectData);
        const projData = project.toObject();
        projData.id = projData._id.toString();
        res.status(201).json({ success: true, data: projData });
    } catch (error) {
        console.error('Project create error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create project' });
    }
});

// PUT update project (Protected)
router.put('/:id', protect, async (req, res) => {
    try {
        const { id, _id, ...projectData } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const projData = project.toObject();
        projData.id = projData._id.toString();
        res.json({ success: true, data: projData });
    } catch (error) {
        console.error('Project update error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to update project' });
    }
});

// DELETE project (Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
});

module.exports = router;
