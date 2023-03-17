'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkTemplatesVariables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.TalkTemplates, {
        targetKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.TalkVariables, {
        targetKey: 'talkVariableId',
        foreignKey: 'talkVariableId',
        onDelete: 'CASCADE',
      });
    }
  }
  TalkTemplatesVariables.init(
    {
      talkTemplatesVariablesId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      talkTemplateId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'TalkTemplates',
          key: 'talkTemplateId',
        },
        onDelete: 'CASCADE',
      },
      talkVariableId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'TalkVariables',
          key: 'talkVariableId',
        },
        onDelete: 'CASCADE',
      },
    },
    { timestamps: false, sequelize, modelName: 'TalkTemplatesVariables' }
  );
  return TalkTemplatesVariables;
};
