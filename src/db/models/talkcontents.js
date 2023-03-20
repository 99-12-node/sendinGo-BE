'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkContents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Clients, {
        targetKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.TalkTemplates, {
        targetKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'talkContentId',
        foreignKey: 'talkContentId',
        onDelete: 'NO ACTION',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'NO ACTION',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'NO ACTION',
      });
    }
  }
  TalkContents.init(
    {
      talkContentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clientId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Clients',
          key: 'clientId',
        },
        onDelete: 'CASCADE',
      },
      talkTemplateId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'TalkTemplates',
          key: 'talkTemplateId',
        },
        onDelete: 'NO ACTION',
      },
      organizationName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      regionDetail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deliveryCompany: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryNumber: {
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
      modelName: 'TalkContents',
    }
  );
  return TalkContents;
};
