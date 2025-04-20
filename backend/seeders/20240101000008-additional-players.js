 "use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("player123", 10);
    
    const players = [];
    
    // Create 10 more players (we already have player1 and player2)
    for (let i = 3; i <= 12; i++) {
      players.push({
        username: `player${i}`,
        password: hashedPassword,
        role: "player",
        name: `选手${i}`,
        email: `player${i}@example.com`,
        phone: `1380000${i.toString().padStart(4, '0')}`,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    
    await queryInterface.bulkInsert("users", players);
  },

  down: async (queryInterface, Sequelize) => {
    const usernames = Array.from({ length: 10 }, (_, i) => `player${i + 3}`);
    await queryInterface.bulkDelete("users", {
      username: usernames
    });
  },
};