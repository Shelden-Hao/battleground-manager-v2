const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "player", "judge"),
      allowNull: false,
      validate: {
        isIn: [["admin", "player", "judge"]],
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

// 实例方法：验证密码
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Define associations method that will be called from index.js
User.associate = function(models) {
  // User as player has many registrations
  User.hasMany(models.Registration, {
    foreignKey: "player_id",
    as: "registrations",
  });
  
  // User as player1 has many matches
  User.hasMany(models.Match, {
    foreignKey: "player1_id",
    as: "matchesAsPlayer1",
  });
  
  // User as player2 has many matches
  User.hasMany(models.Match, {
    foreignKey: "player2_id", 
    as: "matchesAsPlayer2",
  });
  
  // User as winner has many matches
  User.hasMany(models.Match, {
    foreignKey: "winner_id",
    as: "matchesWon",
  });
  
  // User as player has many scores
  User.hasMany(models.Score, {
    foreignKey: "player_id",
    as: "playerScores",
  });
  
  // User as judge has many scores
  User.hasMany(models.Score, {
    foreignKey: "judge_id",
    as: "judgedScores",
  });
};

module.exports = User;
