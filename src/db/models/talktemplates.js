'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkTemplates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.TalkTemplatesVariables, {
        sourceKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'CASCADE',
      });
      this.hasOne(models.TalkContents, {
        sourceKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'CASCADE',
      });
    }
  }
  TalkTemplates.init(
    {
      talkTemplateId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      talkTemplateCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      talkTemplateName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      talkTemplateContent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'TalkTemplates',
    }
  );
  return TalkTemplates;
};
