const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Match = sequelize.define(
  "Match",
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
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    player1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player1_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    player2_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "in_progress", "completed"]],
      },
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "获胜者ID",
    },
  },
  {
    tableName: "matches",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
Match.associate = function(models) {
  Match.belongsTo(models.Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  Match.belongsTo(models.CompetitionStage, {
    foreignKey: "stage_id",
    as: "stage",
  });
  
  Match.belongsTo(models.Group, {
    foreignKey: "group_id", 
    as: "group",
  });

  Match.belongsTo(models.User, {
    foreignKey: "player1_id",
    as: "player1",
  });

  Match.belongsTo(models.User, {
    foreignKey: "player2_id",
    as: "player2",
  });
  
  Match.belongsTo(models.User, {
    foreignKey: "winner_id",
    as: "winner",
  });

  Match.hasMany(models.Score, {
    foreignKey: "match_id",
    as: "scores",
  });
};

module.exports = Match;