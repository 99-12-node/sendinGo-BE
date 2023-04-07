'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Statistics extends Model {
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
    }
  }
  Statistics.init(
    {
      statisticsId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userAfterJoinDate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalClientCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalGroupCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accumulateSendCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accumulateSuccessCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accumulateSuccessRatio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      accumulateSuccessRatio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      talkSendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'Statistics',
    }
  );
  return Statistics;
};
