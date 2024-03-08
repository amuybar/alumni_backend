const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// Authentication Middleware (if needed)
const authMiddleware = (req, res, next) => {
    // Check if user is authenticated
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: "Unauthorized" }); // User is not authenticated, return unauthorized status
    }
};

// Create Feedback
router.post('/', authMiddleware, async (req, res) => {
    const { name, email, feedback } = req.body;
    try {
        Feedback.create(name, email, feedback, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ message: 'Feedback submitted successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Feedback
router.get('/', async (req, res) => {
    try {
        const feedback = await Feedback.getAll();
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Feedback by ID
router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Feedback
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, feedback } = req.body;
    try {
        await Feedback.update(req.params.id, name, email, feedback);
        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Feedback
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Feedback.delete(req.params.id);
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
