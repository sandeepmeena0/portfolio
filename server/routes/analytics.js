const express = require('express');
const router = express.Router();
const { protect } = require('./auth');
const Analytics = require('../models/Analytics');
const Project = require('../models/Project');
const Contact = require('../models/Contact');

// Helper: Parse User-Agent into device, browser, OS
function parseUserAgent(ua) {
    if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

    // Device
    let device = 'Desktop';
    if (/Mobile|Android|iPhone|iPod/i.test(ua)) device = 'Mobile';
    else if (/iPad|Tablet/i.test(ua)) device = 'Tablet';

    // Browser
    let browser = 'Unknown';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua)) browser = 'Safari';
    else if (/MSIE|Trident/i.test(ua)) browser = 'IE';

    // OS
    let os = 'Unknown';
    if (/Windows NT/i.test(ua)) os = 'Windows';
    else if (/Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    return { device, browser, os };
}

// Helper: Get real IP from request
function getIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.connection?.remoteAddress || req.socket?.remoteAddress || '';
}

// POST track pageview (Public)
router.post('/pageview', async (req, res) => {
    try {
        const { path, referrer, userAgent } = req.body;
        const ua = userAgent || req.headers['user-agent'] || '';
        const { device, browser, os } = parseUserAgent(ua);
        const ip = getIP(req);

        await Analytics.create({
            path: path || '/',
            referrer: referrer || '',
            userAgent: ua,
            ip,
            device,
            browser,
            os,
        });

        res.json({ success: true });
    } catch (error) {
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

        // Views by day - last 7 days
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const viewsData = await Analytics.aggregate([
            { $match: { timestamp: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill all 7 days
        const viewsByDay = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            viewsByDay[dateStr] = 0;
        }
        viewsData.forEach(item => {
            if (viewsByDay[item._id] !== undefined) {
                viewsByDay[item._id] = item.views;
            }
        });
        const chartData = Object.keys(viewsByDay).map(date => ({ date, views: viewsByDay[date] }));

        // Today's views
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayViews = await Analytics.countDocuments({ timestamp: { $gte: todayStart } });

        // Device breakdown
        const deviceData = await Analytics.aggregate([
            { $group: { _id: '$device', count: { $sum: 1 } } }
        ]);

        // Browser breakdown
        const browserData = await Analytics.aggregate([
            { $group: { _id: '$browser', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                totalViews,
                todayViews,
                totalProjects,
                totalMessages,
                unreadMessages,
                chartData,
                deviceData,
                browserData
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET recent visitor logs (Protected)
router.get('/logs', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const logs = await Analytics.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .select('path referrer browser os device ip timestamp');

        const total = await Analytics.countDocuments();

        res.json({
            success: true,
            data: logs,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE clear all logs (Protected)
router.delete('/logs', protect, async (req, res) => {
    try {
        await Analytics.deleteMany({});
        res.json({ success: true, message: 'All logs cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
