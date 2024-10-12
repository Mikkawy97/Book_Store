// routes/authors.js
const express = require('express');
const router = express.Router();
const { Author } = require('../models');

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an author by ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).send('Author not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new author
router.post('/', async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an author by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Author.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAuthor = await Author.findByPk(req.params.id);
      res.json(updatedAuthor);
    } else {
      res.status(404).send('Author not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an author by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Author.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Author not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;