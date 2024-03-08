// src/models/user.js
const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
    findByUsername: function(username, callback) {
        db.get("SELECT * FROM users WHERE username = ?", [username], callback);
    },

    createUser: function(username, password, callback) {
        // Check if user with the same username already exists
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, existingUser) => {
            if (err) {
                return callback(err);
            }
            if (existingUser) {
                return callback(new Error("User already exists"));
            }
            // If not, hash the password and create the user
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return callback(err);
                }
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], callback);
            });
        });
    },
    comparePassword: function(password, hash, callback) {
        bcrypt.compare(password, hash, callback);
    },
    resetPassword: function(username, newPassword, callback) {
        // Hash the new password
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                return callback(err);
            }
            // Update user's password in the database
            db.run("UPDATE users SET password = ? WHERE username = ?", [hash, username], callback);
        });
    },

    changePassword: function(username, oldPassword, newPassword, callback) {
        // Retrieve user from the database
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error("User not found"));
            }
            // Compare old password with the one stored in the database
            bcrypt.compare(oldPassword, user.password, (err, match) => {
                if (err) {
                    return callback(err);
                }
                if (!match) {
                    return callback(new Error("Incorrect old password"));
                }
                // If old password matches, hash the new password and update it in the database
                bcrypt.hash(newPassword, 10, (err, hash) => {
                    if (err) {
                        return callback(err);
                    }
                    db.run("UPDATE users SET password = ? WHERE username = ?", [hash, username], callback);
                });
            });
        });
    }
};

module.exports = User;
