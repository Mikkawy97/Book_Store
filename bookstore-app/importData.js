const fs = require('fs');
const csv = require('csv-parser');
const { sequelize, Author, Book, Store, StoreBook } = require('./models');

async function importData(filePath) {
  const authorsMap = new Map();
  const storesMap = new Map();
  const books = [];
  const storeBooksMap = new Map(); // Use a map to track unique store-book pairs

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const authorName = row.author.trim();
      const storeName = row.store_name.trim();
      const storeAddress = row.store_address.trim();
      const bookName = row.book_name.trim();

      // Add author if not already in map
      if (!authorsMap.has(authorName)) {
        authorsMap.set(authorName, { name: authorName });
      }

      // Add store if not already in map
      if (!storesMap.has(storeName)) {
        storesMap.set(storeName, { name: storeName, address: storeAddress });
      }

      // Add book details
      books.push({
        name: bookName,
        pages: parseInt(row.book_pages),
        authorName: authorName
      });

      // Create a unique key for the store-book pair
      const storeBookKey = `${storeName}-${bookName}`;
      if (!storeBooksMap.has(storeBookKey)) {
        storeBooksMap.set(storeBookKey, {
          storeName: storeName,
          bookName: bookName,
          price: parseFloat(row.store_price_for_book),
          sold_out: false
        });
      }
    })
    .on('end', async () => {
      try {
        await sequelize.sync({ force: true });

        const authors = await Author.bulkCreate([...authorsMap.values()]);
        console.log('Authors imported successfully');

        const stores = await Store.bulkCreate([...storesMap.values()]);
        console.log('Stores imported successfully');

        // Resolve author_id for each book and insert books
        for (let book of books) {
          const author = authors.find(a => a.name === book.authorName);
          book.author_id = author.id;
          delete book.authorName;
        }
        const insertedBooks = await Book.bulkCreate(books);
        console.log('Books imported successfully');

        // Resolve store_id and book_id for each store-book and insert store-books
        for (let storeBook of storeBooksMap.values()) {
          const store = stores.find(s => s.name === storeBook.storeName);
          const book = insertedBooks.find(b => b.name === storeBook.bookName);
          if (store && book) {
            storeBook.store_id = store.id;
            storeBook.book_id = book.id;
            delete storeBook.storeName;
            delete storeBook.bookName;
            await StoreBook.create(storeBook); // Insert each store-book relationship
          }
        }
        console.log('StoreBooks imported successfully');
      } catch (error) {
        console.error('Error importing data:', error);
      }
    });
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a path to the CSV file.');
  process.exit(1);
}

importData(filePath);

