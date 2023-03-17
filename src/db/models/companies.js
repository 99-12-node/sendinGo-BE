'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Companies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Users, {
        sourceKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
    }
  }
  Companies.init(
    {
      companyId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      companyNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Companies',
    }
  );
  return Companies;
};
