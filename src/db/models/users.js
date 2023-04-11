'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Companies, {
        targetKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'userId',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.TalkSends, {
        sourceKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.HourlyStatistics, {
        sourceKey: 'userId',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.HourlyStatistics, {
        sourceKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.DailyStatistics, {
        sourceKey: 'userId',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.DailyStatistics, {
        sourceKey: 'companyId',
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Companies',
          key: 'companyId',
        },
        onDelete: 'CASCADE',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'Users',
    }
  );
  return Users;
};
