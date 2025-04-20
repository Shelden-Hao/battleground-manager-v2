 "use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const registrations = [];
    
    // We need at least 8 players, but let's add 12 for good measure (2 existing + 10 new)
    // We already have registrations for player1 and player2 from the demo-registrations seeder
    for (let i = 3; i <= 12; i++) {
      registrations.push({
        competition_id: 1, // Use the first competition
        player_id: i,     // Use the new players we just created
        status: "approved", // Set status to approved
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    
    await queryInterface.bulkInsert("registrations", registrations);
  },

  down: async (queryInterface, Sequelize) => {
    const playerIds = Array.from({ length: 10 }, (_, i) => i + 3);
    await queryInterface.bulkDelete("registrations", {
      player_id: playerIds,
      competition_id: 1
    });
  },
};