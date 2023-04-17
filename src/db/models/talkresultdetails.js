'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkResultDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.TalkSends, {
        targetKey: 'talkSendId',
        foreignKey: 'talkSendId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Clients, {
        targetKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Groups, {
        targetKey: 'groupId',
        foreignKey: 'groupId',
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
    }
  }
  TalkResultDetails.init(
    {
      talkResultDetailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      talkSendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkSends',
          key: 'talkSendId',
        },
        onDelete: 'CASCADE',
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
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'clientId',
        },
        onDelete: 'CASCADE',
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
        onDelete: 'CASCADE',
      },
      msgid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      msgContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sendDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sendState: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resultDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resultState: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastReportDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resultMessage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      buttonContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tplCode: {
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
      modelName: 'TalkResultDetails',
    }
  );
  return TalkResultDetails;
};
