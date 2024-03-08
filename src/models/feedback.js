// models/feedback.js
const sqlite3 = require('sqlite3');
const db = require('../config/database');

const Feedback = {
    create: function(name, email, feedback, callback) {
        const query = `INSERT INTO feedback (name, email, feedback) VALUES (?, ?, ?)`;
        db.run(query, [name, email, feedback], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID);
        });
    },
    // Add other CRUD operations as needed
    getAll: function(callback) {
        const query = `SELECT * FROM feedback`;
        db.all(query, function(err, rows) {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    },
    getById: function(id, callback) {
        const query = `SELECT * FROM feedback WHERE id=?`;
        db.get(query, [id], function(err, row) {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    },
    update: function(id, name, email, feedback, callback) {
        const query = `UPDATE feedback SET name=?, email=?, feedback=? WHERE id=?`;
        db.run(query, [name, email, feedback, id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    },
    delete: function(id, callback) {
        const query = `DELETE FROM feedback WHERE id=?`;
        db.run(query, [id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }
};

module.exports = Feedback;
