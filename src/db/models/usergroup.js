'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        targetKey: 'userId',
        foreignKey: 'userId',
      });
    }
  }
  UserGroup.init(
    {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clientId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'clients',
          key: 'clientId',
        }, //onDelete?
      },
      userGroupDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userGroupTagName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userGroupName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserGroup',
    }
  );
  return UserGroup;
};
