'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    //  */
    static associate(models) {
      // this.belongsTo(models.Users, {
      //   targetKey: 'userId',
      //   foreignKey: 'userId',
      // });
      // this.belongsTo(models.Users, {
      //   targetKey: 'companyId',
      //   foreignKey: 'companyId',
      // });
      this.hasMany(models.TalkContents, {
        sourceKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.ClientGroups, {
        sourceKey: 'clientId',
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
      });
    }
  }
  Clients.init(
    {
      clientId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        // unique: true, true를 하는 것이 맞지만, 대량 발송 테스트를 위해 주석처리
        allowNull: false,
      },
      clientEmail: {
        type: DataTypes.STRING,
        // unique: true, true를 하는 것이 맞지만, 대량 발송 테스트를 위해 주석처리
        allowNull: false,
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
      modelName: 'Clients',
    }
  );
  return Clients;
};
