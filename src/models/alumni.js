const db = require('../config/database');

class Alumni {
  static create(name, year, email, phone, callback) {
    db.run('INSERT INTO alumni (name, year, email, phone) VALUES (?, ?, ?, ?)', [name, year, email, phone], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, this.lastID); // Return the ID of the newly inserted alumni
    });
  }

  static getAll(callback) {
    db.all('SELECT * FROM alumni', function (err, rows) {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  }

  static getById(id, callback) {
    db.get('SELECT * FROM alumni WHERE id = ?', [id], function (err, row) {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  static update(id, name, year, email, phone, callback) {
    db.run('UPDATE alumni SET name = ?, year = ?, email = ?, phone = ? WHERE id = ?', [name, year, email, phone, id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  }

  static delete(id, callback) {
    db.run('DELETE FROM alumni WHERE id = ?', [id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  }
}

module.exports = Alumni;
