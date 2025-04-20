const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CompetitionStage = sequelize.define(
  "CompetitionStage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    competition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM("group", "knockout"),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "in_progress", "completed"]],
      },
    },
  },
  {
    tableName: "competition_stages",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
CompetitionStage.associate = function(models) {
  CompetitionStage.belongsTo(models.Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  CompetitionStage.hasMany(models.Match, {
    foreignKey: "stage_id",
    as: "matches",
  });
};

module.exports = CompetitionStage;
