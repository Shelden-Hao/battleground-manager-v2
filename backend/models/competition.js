const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Competition = sequelize.define(
  "Competition",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (value <= this.start_date) {
            throw new Error("结束日期必须在开始日期之后");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("draft", "registration", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "draft",
      validate: {
        isIn: [["draft", "registration", "in_progress", "completed"]],
      },
    },
  },
  {
    tableName: "competitions",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
Competition.associate = function(models) {
  Competition.hasMany(models.Registration, {
    foreignKey: "competition_id",
    as: "registrations",
  });
  
  Competition.hasMany(models.CompetitionStage, {
    foreignKey: "competition_id",
    as: "stages",
  });
  
  Competition.hasMany(models.Match, {
    foreignKey: "competition_id",
    as: "matches",
  });
};

module.exports = Competition;
