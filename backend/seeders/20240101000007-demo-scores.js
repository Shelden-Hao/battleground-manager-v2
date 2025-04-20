"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("scores", [
      {
        match_id: 8,
        player_id: 1,
        judge_id: 2,
        score: 85.5,
        comments: "表现良好，但还有提升空间",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        match_id: 9,
        player_id: 2,
        judge_id: 2,
        score: 92.5,
        comments: "出色的表现，战术运用娴熟",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("scores", null, {});
  },
};
