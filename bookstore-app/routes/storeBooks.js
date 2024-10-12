// routes/storeBooks.js
const express = require('express');
const router = express.Router();
const { Book, Store, Author } = require('../models');

// Get all store-book relationships
router.get('/', async (req, res) => {
  try {
    const booksWithStoresAndAuthors = await Book.findAll({
      include: [
        {
          model: Store,
          through: {
            attributes: ['store_id', 'price', 'sold_out'], // Include the id from StoreBook
          },
          attributes: ['name', 'address'], // Select store attributes to include
        },
        {
          model: Author,
          attributes: ['name'], // Select author attributes to include
        },
      ],
    });
    res.json(booksWithStoresAndAuthors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific store-book relationship by store_id and book_id
router.get('/:store_id/:book_id', async (req, res) => {
  try {
    const { store_id, book_id } = req.params;
    const storeBook = await StoreBook.findOne({ where: { store_id, book_id } });
    if (storeBook) {
      res.json(storeBook);
    } else {
      res.status(404).send('StoreBook relationship not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new store-book relationship
router.post('/', async (req, res) => {
  try {
    const storeBook = await StoreBook.create(req.body);
    res.status(201).json(storeBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a store-book relationship by store_id and book_id
router.put('/:store_id/:book_id', async (req, res) => {
  try {
    const { store_id, book_id } = req.params;
    const [updated] = await StoreBook.update(req.body, {
      where: { store_id, book_id }
    });
    if (updated) {
      const updatedStoreBook = await StoreBook.findOne({ where: { store_id, book_id } });
      res.json(updatedStoreBook);
    } else {
      res.status(404).send('StoreBook relationship not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a store-book relationship by store_id and book_id
router.delete('/:store_id/:book_id', async (req, res) => {
  try {
    const { store_id, book_id } = req.params;
    const deleted = await StoreBook.destroy({
      where: { store_id, book_id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('StoreBook relationship not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/:storeId/:bookId/sell', async (req, res) => {
  try {
    const { storeId, bookId } = req.params;
    const storeBook = await StoreBook.findOne({
      where: { store_id: storeId, book_id: bookId }
    });
    if (!storeBook) {
      return res.status(404).json({ message: 'StoreBook not found' });
    }
    storeBook.sold_out = true;
    await storeBook.save();
    res.json(storeBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;