'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.User, {
      //   targetKey: 'userId',
      //   foreignKey: 'userId',
      // });
    }
  }
  ClientGroup.init(
    {
      groupId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      // userId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'user',
      //     key: 'userId',
      //   },
      // },
      clientGroupDescription: {
        type: DataTypes.STRING,
      },
      clientGroupName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ClientGroup',
    }
  );
  return ClientGroup;
};
