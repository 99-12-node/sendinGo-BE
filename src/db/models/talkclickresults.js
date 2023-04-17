'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkClickResults extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.TalkResultDetails, {
        targetKey: 'talkResultDetailId',
        foreignKey: 'talkResultDetailId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.TalkSends, {
        targetKey: 'talkSendId',
        foreignKey: 'talkSendId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Users, {
        targetKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Groups, {
        targetKey: 'groupId',
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Clients, {
        targetKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.TalkContents, {
        targetKey: 'talkContentId',
        foreignKey: 'talkContentId',
        onDelete: 'CASCADE',
      });
    }
  }
  TalkClickResults.init(
    {
      talkClickResultId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      talkResultDetailId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'TalkResultDetails',
          key: 'talkResultDetailId',
        },
        onDelete: 'CASCADE',
      },
      talkSendId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'TalkSends',
          key: 'talkSendId',
        },
      },
      originLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trackingUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clickDevice: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clickOs: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clickBrowser: {
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
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'companyId',
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'clientId',
        },
      },
      talkContentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkContents',
          key: 'talkContentId',
        },
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
      modelName: 'TalkClickResults',
    }
  );
  return TalkClickResults;
};
