"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert("users", [
      {
        username: "admin",
        password: hashedPassword,
        role: "admin",
        name: "系统管理员",
        email: "admin@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "judge1",
        password: hashedPassword,
        role: "judge",
        name: "裁判一",
        email: "judge1@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "player1",
        password: hashedPassword,
        role: "player",
        name: "选手一",
        email: "player1@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "player2",
        password: hashedPassword,
        role: "player",
        name: "选手二",
        email: "player2@example.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
