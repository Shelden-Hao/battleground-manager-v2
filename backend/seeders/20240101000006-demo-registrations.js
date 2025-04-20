"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("registrations", [
      {
        competition_id: 1,
        player_id: 1,
        status: "approved",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        player_id: 2,
        status: "approved",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("registrations", null, {});
  },
};
