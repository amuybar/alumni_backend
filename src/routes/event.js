// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Authentication Middleware for restricted operations
const authMiddleware = (req, res, next) => {
    // Check if user is authenticated
    if (req.session.user) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: "Unauthorized" }); // User is not authenticated, return unauthorized status
    }
};

// Get all events
router.get('/', async (req, res) => {
    try {
        Event.getAll((err, events) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(events);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single event (Public route)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event == null) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create an event (Authenticated route)
router.post('/', authMiddleware, async (req, res) => {
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        description: req.body.description,
        location: req.body.location
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an event (Authenticated route)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event (Authenticated route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
