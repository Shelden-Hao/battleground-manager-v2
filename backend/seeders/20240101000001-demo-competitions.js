"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 创建示例比赛
    const competitions = await queryInterface.bulkInsert(
      "competitions",
      [
        {
          title: "2024年第一季度象棋比赛",
          description: "这是一个测试用的象棋比赛，包含小组赛和淘汰赛阶段。",
          start_date: new Date("2024-01-15"),
          end_date: new Date("2024-03-31"),
          status: "registration",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // 创建比赛阶段
    await queryInterface.bulkInsert("competition_stages", [
      {
        competition_id: 1,
        name: "小组赛",
        type: "group",
        order: 1,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        name: "淘汰赛",
        type: "knockout",
        order: 2,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // 创建小组
    await queryInterface.bulkInsert("groups", [
      {
        competition_id: 1,
        stage_id: 1,
        name: "A组",
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        competition_id: 1,
        stage_id: 1,
        name: "B组",
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("groups", null, {});
    await queryInterface.bulkDelete("competition_stages", null, {});
    await queryInterface.bulkDelete("competitions", null, {});
  },
};
