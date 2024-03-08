// models/event.js
const sqlite3 = require('sqlite3');

const db = require('../config/database');

const Event = {
    create: function(title, date, time, description, location, callback) {
        const query = `INSERT INTO events (title, date, time, description, location) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [title, date, time, description, location], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID);
        });
    },
    update: function(id, title, date, time, description, location, callback) {
        const query = `UPDATE events SET title=?, date=?, time=?, description=?, location=? WHERE id=?`;
        db.run(query, [title, date, time, description, location, id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    },
    delete: function(id, callback) {
        const query = `DELETE FROM events WHERE id=?`;
        db.run(query, [id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    },
    getAll: function(callback) {
        const query = `SELECT * FROM events`;
        db.all(query, function(err, rows) {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }
};

module.exports = Event;
