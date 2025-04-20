const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Registration = sequelize.define(
  "Registration",
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
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "approved", "rejected"]],
      },
    },
  },
  {
    tableName: "registrations",
    timestamps: true,
    underscored: true,
  }
);

// Define associations method that will be called from index.js
Registration.associate = function(models) {
  Registration.belongsTo(models.Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  Registration.belongsTo(models.User, {
    foreignKey: "player_id",
    as: "player",
  });
};

module.exports = Registration;
