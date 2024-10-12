// routes/stores.js
const express = require('express');
const router = express.Router();
const {Store} = require('../models');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (store) {
      res.json(store);
    } else {
      res.status(404).send('Store not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new store
router.post('/', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a store by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Store.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedStore = await Store.findByPk(req.params.id);
      res.json(updatedStore);
    } else {
      res.status(404).send('Store not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a store by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Store.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Store not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;