const db = require('../config/database');


const Survey = {
    // Function to create a new survey
    createSurvey: function(question, options, callback) {
        // Check if options is an array
        if (!Array.isArray(options)) {
            return callback(new Error('Options must be an array'));
        }

        // Insert survey question into the 'surveys' table
        const insertSurveyQuery = 'INSERT INTO surveys (question) VALUES (?)';
        db.run(insertSurveyQuery, [question], function(err) {
            if (err) {
                return callback(err);
            }
            const surveyId = this.lastID;

            // Insert options into the 'options' table
            const insertOptionsQuery = 'INSERT INTO options (survey_id, option) VALUES (?, ?)';
            const promises = options.map(option => {
                return new Promise((resolve, reject) => {
                    db.run(insertOptionsQuery, [surveyId, option], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Wait for all option insertions to complete
            Promise.all(promises)
                .then(() => {
                    callback(null, surveyId);
                })
                .catch(err => {
                    callback(err);
                });
        });
    },
    // Function to get all surveys with options
    getAllSurveys: function(callback) {
        const query = `
            SELECT surveys.id, surveys.question, options.option
            FROM surveys
            LEFT JOIN options ON surveys.id = options.survey_id
        `;
        db.all(query, function(err, rows) {
            if (err) {
                return callback(err);
            }
    
            const surveysMap = new Map(); // Use a map to group options by survey ID
    
            rows.forEach(row => {
                const surveyId = row.id;
                const question = row.question;
                const option = row.option;
    
                if (!surveysMap.has(surveyId)) {
                    // If survey is not yet in the map, initialize it with an empty array of options
                    surveysMap.set(surveyId, {
                        id: surveyId,
                        question: question,
                        options: []
                    });
                }
    
                // Add option to the corresponding survey
                const survey = surveysMap.get(surveyId);
                if (option) {
                    survey.options.push(option);
                }
            });
    
            // Convert map values to an array of surveys
            const surveys = Array.from(surveysMap.values());
            callback(null, surveys);
        });
    },
    

    // Function to get a survey by its ID with options
    getSurveyById: function(id, callback) {
        const query = `
            SELECT surveys.id, surveys.question, GROUP_CONCAT(options.option) AS options
            FROM surveys
            LEFT JOIN options ON surveys.id = options.survey_id
            WHERE surveys.id = ?
            GROUP BY surveys.id
        `;
        db.get(query, [id], function(err, row) {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    },

    // Function to delete a survey by its ID
    deleteSurvey: function(id, callback) {
        // Delete survey options
        const deleteOptionsQuery = 'DELETE FROM options WHERE survey_id = ?';
        db.run(deleteOptionsQuery, [id], function(err) {
            if (err) {
                return callback(err);
            }

            // Delete survey
            const deleteSurveyQuery = 'DELETE FROM surveys WHERE id = ?';
            db.run(deleteSurveyQuery, [id], function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    }
};

module.exports = Survey;
