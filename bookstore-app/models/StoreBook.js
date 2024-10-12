module.exports = (sequelize, DataTypes) => {
    const StoreBook = sequelize.define('StoreBook', {
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      sold_out: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  
    return StoreBook;
  };