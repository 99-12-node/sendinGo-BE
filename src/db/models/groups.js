'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
      });
      this.belongsTo(models.Users, {
        targetKey: 'companyId',
        foreignKey: 'companyId',
      });
    }
  }
  Groups.init(
    {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      groupDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'companyId',
        },
        onDelete: 'CASCADE',
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
      modelName: 'ClientGroups',
    }
  );
  return Groups;
};
