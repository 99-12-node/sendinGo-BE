'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.User, {
      //   targetKey: "userId",
      //   foreignKey: "userId",
      // });
      this.belongsTo(models.ClientGroup, {
        targetKey: 'groupId',
        foreignKey: 'groupId',
      });
    }
  }
  Client.init(
    {
      clientId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'User',
      //     key: 'userId',
      //   },
      // },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ClientGroup',
          key: 'groupId',
        },
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
      modelName: 'Client',
    }
  );
  return Client;
};
