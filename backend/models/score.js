const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Score = sequelize.define(
  "Score",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    match_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    judge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "scores",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
Score.associate = function(models) {
  Score.belongsTo(models.Match, {
    foreignKey: "match_id",
    as: "match",
  });

  Score.belongsTo(models.User, {
    foreignKey: "player_id",
    as: "player",
  });

  Score.belongsTo(models.User, {
    foreignKey: "judge_id",
    as: "judge",
  });
};

module.exports = Score;
