"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("group_players", [
      // Group A players
      {
        group_id: 1,
        player_id: 3, // player1
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        group_id: 1,
        player_id: 4, // player2
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Group B players (reusing the same players temporarily)
      {
        group_id: 2,
        player_id: 3, // player1
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        group_id: 2,
        player_id: 4, // player2
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("group_players", null, {});
  },
};
