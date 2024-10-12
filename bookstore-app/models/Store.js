module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Store;
  };