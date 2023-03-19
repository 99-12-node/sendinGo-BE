'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TalkSends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.Users, {
      //   targetKey: 'userId',
      //   foreignKey: 'userId',
      //   onDelete: 'CASCADE',
      // });
      // this.belongsTo(models.Users, {
      //   targetKey: 'companyId',
      //   foreignKey: 'companyId',
      //   onDelete: 'CASCADE',
      // });
      this.belongsTo(models.TalkContents, {
        targetKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'NO ACTION',
      });
      this.belongsTo(models.Groups, {
        targetKey: 'groupId',
        foreignKey: 'groupId',
        onDelete: 'NO ACTION',
      });
      this.belongsTo(models.TalkContents, {
        targetKey: 'talkTemplateId',
        foreignKey: 'talkTemplateId',
        onDelete: 'NO ACTION',
      });
      this.belongsTo(models.TalkContents, {
        targetKey: 'talkContentId',
        foreignKey: 'talkContentId',
        onDelete: 'NO ACTION',
      });
    }
  }
  TalkSends.init(
    {
      talkSendId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      scnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fcnt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      msgCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      msgContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sendState: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sendDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // userId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'userId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      // companyId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'Users',
      //     key: 'companyId',
      //   },
      //   onDelete: 'CASCADE',
      // },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Groups',
          key: 'groupId',
        },
        onDelete: 'NO ACTION',
      },
      talkContentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkContents',
          key: 'talkContentId',
        },
        onDelete: 'NO ACTION',
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkContents',
          key: 'clientId',
        },
        onDelete: 'NO ACTION',
      },
      talkTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TalkContents',
          key: 'talkTemplateId',
        },
        onDelete: 'NO ACTION',
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
      modelName: 'TalkSends',
    }
  );
  return TalkSends;
};
