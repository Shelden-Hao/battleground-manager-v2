 const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GroupPlayer = sequelize.define(
  "GroupPlayer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "选手在小组中的排名",
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "选手在小组中的积分",
    },
  },
  {
    tableName: "group_players",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
GroupPlayer.associate = function(models) {
  GroupPlayer.belongsTo(models.Group, {
    foreignKey: "group_id",
    as: "group",
  });

  GroupPlayer.belongsTo(models.User, {
    foreignKey: "player_id",
    as: "player",
  });
};

module.exports = GroupPlayer;