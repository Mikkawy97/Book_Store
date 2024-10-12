const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Import Models
const Author = require('./Author')(sequelize, DataTypes);
const Book = require('./Book')(sequelize, DataTypes);
const Store = require('./Store')(sequelize, DataTypes);
const StoreBook = require('./StoreBook')(sequelize, DataTypes);

// Define Relationships
Author.hasMany(Book, { foreignKey: 'author_id' });
Book.belongsTo(Author, { foreignKey: 'author_id' });

Store.belongsToMany(Book, { through: StoreBook, foreignKey: 'store_id' });
Book.belongsToMany(Store, { through: StoreBook, foreignKey: 'book_id' });

// Export everything
module.exports = { sequelize, Author, Book, Store, StoreBook };