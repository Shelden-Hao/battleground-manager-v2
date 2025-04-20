"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("matches", [
      // 初赛小组赛 - A组
      {
        competition_id: 1,
        stage_id: 1,
        group_id: 1,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-01T09:00:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        stage_id: 1,
        group_id: 1,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-01T09:30:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      // 初赛小组赛 - B组
      {
        competition_id: 1,
        stage_id: 1,
        group_id: 2,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-01T10:00:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        stage_id: 1,
        group_id: 2,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-01T10:30:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      // 复赛 - 4强赛 (reducing to 4 players total)
      {
        competition_id: 1,
        stage_id: 2,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-03T09:00:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        stage_id: 2,
        player1_id: 3,
        player2_id: 4,
        player1_score: 0,
        player2_score: 0,
        status: "PENDING",
        scheduled_time: new Date("2024-02-03T09:30:00"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("matches", null, {});
  },
};
