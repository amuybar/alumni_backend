// routes/survey.js
const express = require('express');
const router = express.Router();
const Survey = require('../models/survey');

// Route to create a new survey
router.post('/', (req, res) => {
    const { question, options } = req.body; // Assuming options is an array of strings
    Survey.createSurvey(question, options, (err, surveyId) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ id: surveyId, message: 'Survey created successfully' });
    });
  });

// Route to get all surveys
router.get('/', (req, res) => {
  Survey.getAllSurveys((err, surveys) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json(surveys);
  });
});

// Route to get a survey by its ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Survey.getSurveyById(id, (err, survey) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.status(200).json(survey);
  });
});

// Route to delete a survey by its ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Survey.deleteSurvey(id, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: 'Survey deleted successfully' });
  });
});

module.exports = router;
