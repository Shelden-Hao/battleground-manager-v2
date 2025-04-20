const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define(
  "Group",
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
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
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
    tableName: "groups",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
Group.associate = function(models) {
  Group.belongsTo(models.Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  Group.belongsTo(models.CompetitionStage, {
    foreignKey: "stage_id",
    as: "stage",
  });
  
  Group.hasMany(models.GroupPlayer, {
    foreignKey: "group_id",
    as: "players",
  });
  
  Group.hasMany(models.Match, {
    foreignKey: "group_id",
    as: "matches",
  });
};

module.exports = Group;
