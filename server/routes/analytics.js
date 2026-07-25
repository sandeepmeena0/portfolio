const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Analytics = require('../models/Analytics');
const Project = require('../models/Project');
const Contact = require('../models/Contact');

// POST track pageview (Public)
router.post('/pageview', async (req, res) => {
    try {
        const { path, referrer, userAgent } = req.body;
        
        await Analytics.create({
            path: path || '/',
            referrer: referrer || '',
            userAgent: userAgent || req.headers['user-agent'] || ''
        });
        
        res.json({ success: true });
    } catch (error) {
        // Silently fail for analytics tracking
        res.status(500).json({ success: false });
    }
});

// GET analytics summary (Protected)
router.get('/summary', protect, async (req, res) => {
    try {
        const totalViews = await Analytics.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalMessages = await Contact.countDocuments();
        const unreadMessages = await Contact.countDocuments({ read: false });
        
        // Group views by day for the last 7 days using aggregation pipeline
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const viewsData = await Analytics.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Generate the 7 days framework
        const viewsByDay = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            viewsByDay[dateStr] = 0;
        }

        // Map aggregated data
        viewsData.forEach(item => {
            if (viewsByDay[item._id] !== undefined) {
                viewsByDay[item._id] = item.views;
            }
        });

        const chartData = Object.keys(viewsByDay).map(date => ({
            date,
            views: viewsByDay[date]
        }));
        
        res.json({
            success: true,
            data: {
                totalViews,
                totalProjects,
                totalMessages,
                unreadMessages,
                chartData
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
