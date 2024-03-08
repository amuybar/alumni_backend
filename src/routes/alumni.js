const express = require('express');
const Alumni = require('../models/alumni');

const router = express.Router();

// Create alumni
router.post('/', (req, res) => {
  const { name, year, email, phone } = req.body;
  Alumni.create(name, year, email, phone, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id });
  });
});

// Get all alumni
router.get('/', (req, res) => {
  Alumni.getAll((err, alumni) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(alumni);
  });
});

// Get alumni by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Alumni.getById(id, (err, alumni) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.json(alumni);
  });
});

// Update alumni
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, year, email, phone } = req.body;
  Alumni.update(id, name, year, email, phone, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Alumni updated successfully' });
  });
});

// Delete alumni
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Alumni.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Alumni deleted successfully' });
  });
});

module.exports = router;
