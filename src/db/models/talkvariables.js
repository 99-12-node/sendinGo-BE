'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkVariables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.TalkVariables, {
        sourceKey: 'talkVariableId',
        foreignKey: 'talkVariableId',
        onDelete: 'CASCADE',
      });
    }
  }
  TalkVariables.init(
    {
      talkVariableId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      talkVariableEng: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      talkVariableEng: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    { timestamps: false, sequelize, modelName: 'TalkVariables' }
  );
  return TalkVariables;
};
