// src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Registration endpoint
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    User.createUser(username, password, (err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to register user" });
        }
        res.json({ message: "User registered successfully" });
    });
});

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        User.comparePassword(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            if (!match) {
                return res.status(401).json({ message: "Invalid username or password" });
            }
            req.session.user = user;
            res.json({ message: "Login successful" });
        });
    });
});

// Password reset endpoint
router.post('/reset-password', (req, res) => {
    const { username, newPassword } = req.body;
    User.resetPassword(username, newPassword, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ message: "Password reset successful" });
    });
});

// Change password endpoint
router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    User.changePassword(username, oldPassword, newPassword, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ message: "Password changed successfully" });
    });
});
// Logout endpoint
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logout successful" });
});

module.exports = router;
