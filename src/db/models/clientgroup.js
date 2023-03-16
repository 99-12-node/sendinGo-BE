'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //   this.belongsTo(models.Clients, {
      //     targetKey: 'clientId',
      //     foreignKey: 'clientId',
      // onDelete: 'CASCADE',
      //   });
      this.belongsTo(models.Groups, {
        targetKey: 'groupId',
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
      });
    }
  }
  ClientGroups.init(
    {
      clientGroupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      // clientId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Clients',
      //     key: 'clientId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ClientGroups',
    }
  );
  return ClientGroups;
};
