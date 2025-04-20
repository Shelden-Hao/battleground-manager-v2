"use strict";

/**
 * 创建一个种子文件，确保比赛ID 504的数据可以正确显示
 * 该比赛已有32名选手和评分数据，我们需要更新状态使其可以显示
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 找到已有的比赛 ID 504
      const competition = await queryInterface.sequelize.query(
        "SELECT id, title FROM competitions WHERE id = 504",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (competition.length === 0) {
        console.log('找不到ID为504的比赛，请确认比赛ID');
        return;
      }
      
      const competitionId = competition[0].id;
      console.log('找到比赛:', competitionId, competition[0].title);
      
      // 获取该比赛的所有阶段
      const stages = await queryInterface.sequelize.query(
        `SELECT id, name, type FROM competition_stages WHERE competition_id = ${competitionId} ORDER BY \`order\``,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (stages.length < 2) {
        console.log('比赛阶段数据不完整');
        return;
      }
      
      const qualificationStageId = stages[0].id;
      const knockoutStageId = stages[1].id;
      console.log('资格赛阶段ID:', qualificationStageId);
      console.log('淘汰赛阶段ID:', knockoutStageId);
      
      // 更新阶段状态为已完成
      await queryInterface.sequelize.query(
        `UPDATE competition_stages SET status = 'completed' WHERE id = ${qualificationStageId}`
      );
      console.log('已更新资格赛阶段状态为已完成');
      
      // 查找资格赛比赛
      const qualificationMatches = await queryInterface.sequelize.query(
        `SELECT id FROM matches WHERE competition_id = ${competitionId} AND stage_id = ${qualificationStageId} LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (qualificationMatches.length === 0) {
        console.log('找不到资格赛比赛数据');
        return;
      }
      
      const qualificationMatchId = qualificationMatches[0].id;
      console.log('资格赛比赛ID:', qualificationMatchId);
      
      // 更新资格赛比赛状态为已完成
      await queryInterface.sequelize.query(
        `UPDATE matches SET status = 'completed' WHERE id = ${qualificationMatchId}`
      );
      console.log('已更新资格赛比赛状态为已完成');
      
      // 查询所有选手评分，排序获取排名
      const scores = await queryInterface.sequelize.query(
        `SELECT s.player_id, s.score, u.name 
         FROM scores s 
         JOIN users u ON s.player_id = u.id 
         WHERE s.match_id = ${qualificationMatchId} 
         ORDER BY s.score DESC`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (scores.length === 0) {
        console.log('找不到选手评分数据');
        return;
      }
      
      console.log(`找到 ${scores.length} 条评分数据`);
      
      // 显示前10名选手的分数
      console.log('前10名选手排名:');
      for (let i = 0; i < Math.min(10, scores.length); i++) {
        console.log(`${i+1}. ${scores[i].name}: ${scores[i].score}`);
      }
      
      // 检查淘汰赛对战数据
      const knockoutMatches = await queryInterface.sequelize.query(
        `SELECT id, player1_id, player2_id FROM matches WHERE competition_id = ${competitionId} AND stage_id = ${knockoutStageId}`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      console.log(`找到 ${knockoutMatches.length} 场淘汰赛对战`);
      
      if (knockoutMatches.length > 0) {
        // 确保已经正确设置对战，不需要再创建
        console.log('对战数据已存在，无需修改');
      } else {
        // 如果没有对战数据，按照排名规则创建对战
        console.log('开始创建对战数据...');
        
        // 按照第一名vs第三十二名，第二名vs第三十一名的规则生成配对
        const pairs = [];
        for (let i = 0; i < 16; i++) {
          pairs.push([scores[i].player_id, scores[31 - i].player_id]);
        }
        
        // 创建16强对战
        const knockoutMatches = pairs.map((pair, index) => ({
          competition_id: competitionId,
          stage_id: knockoutStageId,
          player1_id: pair[0],
          player2_id: pair[1],
          status: "pending",
          scheduled_time: new Date(Date.now() + (index * 30 * 60 * 1000)),
          player1_score: 0,
          player2_score: 0,
          created_at: new Date(),
          updated_at: new Date()
        }));
        
        // 插入16强对战
        await queryInterface.bulkInsert("matches", knockoutMatches);
        console.log('16强对战数据插入成功');
      }
      
      console.log('=========================================');
      console.log('数据准备完成，现在可以访问:');
      console.log(`1. 排名页面: http://localhost:8000/rankings/competition/${competitionId}`);
      console.log(`2. 对战表: http://localhost:8000/matchups/competition/${competitionId}/stage/${knockoutStageId}`);
      console.log('=========================================');
      
    } catch (error) {
      console.error('准备数据失败:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // 此函数不会删除任何数据，只是重置状态
      const competitionId = 504;
      
      // 查询资格赛阶段
      const stages = await queryInterface.sequelize.query(
        `SELECT id FROM competition_stages WHERE competition_id = ${competitionId} ORDER BY \`order\``,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (stages.length >= 1) {
        const qualificationStageId = stages[0].id;
        
        // 重置阶段状态
        await queryInterface.sequelize.query(
          `UPDATE competition_stages SET status = 'in_progress' WHERE id = ${qualificationStageId}`
        );
        
        // 重置比赛状态
        await queryInterface.sequelize.query(
          `UPDATE matches SET status = 'in_progress' WHERE competition_id = ${competitionId} AND stage_id = ${qualificationStageId}`
        );
      }
      
      console.log('状态已重置');
    } catch (error) {
      console.error('重置状态失败:', error);
      throw error;
    }
  }
}; 