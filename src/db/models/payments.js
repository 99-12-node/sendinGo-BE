'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Companies, {
        targetKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
    }
  }
  Payments.init(
    {
      paymentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      paidName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      paidAmount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      payMethod: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      paidAt: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      merchantUid: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      impUid: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      pgProvider: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      companyId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Companies',
          key: 'companyId',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: 'Payments',
    }
  );
  return Payments;
};
