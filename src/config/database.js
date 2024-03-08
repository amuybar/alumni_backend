
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('database.db');


db.serialize(() => {
    //user table
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
     // alumni table
    db.run("CREATE TABLE IF NOT EXISTS alumni (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, email TEXT, phone TEXT)");

      //events table
    db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, time TEXT, description TEXT, location TEXT)");
    
      //feedback table
    db.run("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, feedback TEXT)");

    // Create surveys table
    db.run(`
        CREATE TABLE IF NOT EXISTS surveys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL
        )
    `);

    // Create options table
    db.run(`
        CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id INTEGER,
            option TEXT NOT NULL,
            FOREIGN KEY (survey_id) REFERENCES surveys(id)
        )
    `);
  });
module.exports = db;
