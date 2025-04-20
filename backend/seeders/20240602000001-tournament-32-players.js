"use strict";
const bcrypt = require("bcryptjs");

// 生成32名选手的数据
const generatePlayers = async (timestamp) => {
  const hashedPassword = await bcrypt.hash("player123", 10);
  const players = [];
  for (let i = 1; i <= 32; i++) {
    players.push({
      username: `player_${timestamp}_${i}`,
      password: hashedPassword,
      role: "player",
      name: `霹雳舞选手${i}`,
      email: `player_${timestamp}_${i}@example.com`,
      phone: `1390000${i.toString().padStart(4, '0')}`,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
  return players;
};

// 生成评分数据
const generateScores = (matchId, playerId, judgeId) => {
  // 生成60-100之间的随机分数，保留一位小数
  const score = Math.floor(Math.random() * 400 + 600) / 10;
  return {
    match_id: matchId,
    player_id: playerId,
    judge_id: judgeId,
    score: score,
    comments: `选手表现${score > 80 ? '出色' : score > 70 ? '优秀' : score > 60 ? '良好' : '一般'}`,
    created_at: new Date(),
    updated_at: new Date()
  };
};

// 生成对战数据
const generateMatches = (competitionId, stageId, playerPairs) => {
  return playerPairs.map((pair, index) => ({
    competition_id: competitionId,
    stage_id: stageId,
    player1_id: pair[0],
    player2_id: pair[1],
    status: "pending",
    scheduled_time: new Date(Date.now() + (index * 30 * 60 * 1000)),
    player1_score: 0,
    player2_score: 0,
    created_at: new Date(),
    updated_at: new Date()
  }));
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 查询已有的用户ID，确保不会冲突
      const existingUsers = await queryInterface.sequelize.query(
        "SELECT MAX(id) as maxId FROM users",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const startUserId = (existingUsers[0].maxId || 0) + 1;
      
      // 生成时间戳后缀，确保唯一性
      const timestamp = Date.now().toString().slice(-8); // 使用时间戳后8位作为后缀
      const judgeUsername = `judge_${timestamp}`;
      
      // 创建一个裁判账户
      const judgeId = startUserId;
      const judge = {
        id: judgeId,
        username: judgeUsername,
        password: await bcrypt.hash("judge123", 10),
        role: "judge",
        name: "霹雳舞评委",
        email: `${judgeUsername}@example.com`,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // 创建32名选手，用时间戳确保用户名唯一
      const playersData = await generatePlayers(timestamp);
      const players = playersData.map((player, index) => ({
        ...player,
        id: startUserId + index + 1
      }));
      
      // 创建选手ID数组
      const playerIds = players.map(p => p.id);
      
      console.log('开始插入用户数据...');
      // 插入裁判和选手数据
      await queryInterface.bulkInsert("users", [judge]);
      await queryInterface.bulkInsert("users", players);
      console.log('用户数据插入成功，裁判ID:', judgeId, '选手ID范围:', playerIds[0], '-', playerIds[playerIds.length-1]);
      
      // 创建比赛
      const competitionData = {
        title: `霹雳舞锦标赛_${timestamp}`,
        description: "全国32强选手争夺霹雳舞最高荣誉",
        start_date: new Date(),
        end_date: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)),
        status: "in_progress",
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // 插入比赛数据 - 不要使用解构赋值
      await queryInterface.bulkInsert(
        "competitions",
        [competitionData]
      );
      
      // 手动查询刚创建的比赛ID
      const competitions = await queryInterface.sequelize.query(
        `SELECT id FROM competitions WHERE title = '${competitionData.title}' ORDER BY id DESC LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const competitionId = competitions[0].id;
      console.log('比赛创建成功，ID:', competitionId);
      
      // 创建比赛阶段
      const stages = [
        {
          competition_id: competitionId,
          name: "资格赛",
          type: "group", // 修改为数据库支持的值
          order: 1,
          status: "completed",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          competition_id: competitionId,
          name: "16强赛",
          type: "knockout",
          order: 2,
          status: "pending",
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await queryInterface.bulkInsert("competition_stages", stages);
      
      // 查询刚创建的阶段ID
      const stagesData = await queryInterface.sequelize.query(
        `SELECT id FROM competition_stages WHERE competition_id = ${competitionId} ORDER BY \`order\``,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const qualificationStageId = stagesData[0].id;
      const knockoutStageId = stagesData[1].id;
      console.log('比赛阶段创建成功，资格赛ID:', qualificationStageId, '16强赛ID:', knockoutStageId);
      
      // 先为32名选手生成随机分数
      const playerScores = [];
      const playerWithScores = [];
      
      for (let i = 0; i < 32; i++) {
        // 生成随机分数 (60-100)，保留一位小数
        const scoreValue = Math.floor(Math.random() * 400 + 600) / 10;
        const playerId = playerIds[i];
        
        playerWithScores.push({
          id: playerId,
          score: scoreValue
        });
      }
      
      // 创建资格赛比赛记录 - 确保提供了所有必需的字段
      // 资格赛是所有选手一起参加，所以我们指定第一位选手和第二位选手作为代表
      const qualificationMatch = {
        competition_id: competitionId,
        stage_id: qualificationStageId,
        player1_id: playerIds[0], // 第一位选手
        player2_id: playerIds[1], // 第二位选手
        status: "completed",
        scheduled_time: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)), // 两天前
        player1_score: 0,
        player2_score: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // 插入资格赛比赛 - 不要使用解构赋值
      await queryInterface.bulkInsert("matches", [qualificationMatch]);
      
      // 查询刚创建的比赛ID
      const matchData = await queryInterface.sequelize.query(
        `SELECT id FROM matches WHERE competition_id = ${competitionId} AND stage_id = ${qualificationStageId} LIMIT 1`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const matchId = matchData[0].id;
      console.log('资格赛比赛创建成功，ID:', matchId);
      
      // 为32名选手创建评分记录
      for (let i = 0; i < 32; i++) {
        const playerId = playerIds[i];
        const scoreValue = playerWithScores.find(p => p.id === playerId).score;
        
        playerScores.push({
          match_id: matchId,
          player_id: playerId,
          judge_id: judgeId,
          score: scoreValue,
          comments: `选手表现${scoreValue > 80 ? '出色' : scoreValue > 70 ? '优秀' : scoreValue > 60 ? '良好' : '一般'}`,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      // 插入评分数据
      await queryInterface.bulkInsert("scores", playerScores);
      console.log('评分数据插入成功');
      
      // 根据评分排序
      const sortedPlayers = [...playerWithScores].sort((a, b) => b.score - a.score);
      
      // 按照第一名vs第三十二名，第二名vs第三十一名的规则生成配对
      const pairs = [];
      for (let i = 0; i < 16; i++) {
        pairs.push([sortedPlayers[i].id, sortedPlayers[31 - i].id]);
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
      
      // 添加选手报名记录
      const registrations = playerIds.map(id => ({
        competition_id: competitionId,
        player_id: id,
        status: "approved",
        created_at: new Date(),
        updated_at: new Date()
      }));
      
      // 插入报名记录
      await queryInterface.bulkInsert("registrations", registrations);
      console.log('报名记录数据插入成功');
      
      console.log('========== 种子数据创建成功！==========');
      console.log('裁判用户名:', judgeUsername);
      console.log('裁判ID:', judgeId);
      console.log('选手ID范围:', playerIds[0], '-', playerIds[playerIds.length-1]);
      console.log('比赛标题:', competitionData.title);
      console.log('比赛ID:', competitionId);
      console.log('资格赛ID:', qualificationStageId);
      console.log('16强赛ID:', knockoutStageId);
      console.log('资格赛比赛ID:', matchId);
      console.log('16强对战已创建');
      console.log('========================================');
      
    } catch (error) {
      console.error('种子数据创建失败:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // 查找当前种子创建的比赛（使用LIKE查询以匹配时间戳后缀）
      const competitions = await queryInterface.sequelize.query(
        "SELECT id, title FROM competitions WHERE title LIKE '霹雳舞锦标赛_%'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (competitions.length > 0) {
        for (const competition of competitions) {
          const competitionId = competition.id;
          
          // 查找相关的阶段和比赛
          const stages = await queryInterface.sequelize.query(
            `SELECT id FROM competition_stages WHERE competition_id = ${competitionId}`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          const stageIds = stages.map(s => s.id);
          
          const matches = await queryInterface.sequelize.query(
            `SELECT id FROM matches WHERE competition_id = ${competitionId}`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          const matchIds = matches.map(m => m.id);
          
          // 删除评分数据
          if (matchIds.length > 0) {
            await queryInterface.bulkDelete("scores", { 
              match_id: { [Sequelize.Op.in]: matchIds } 
            });
          }
          
          // 删除比赛数据
          await queryInterface.bulkDelete("matches", { 
            competition_id: competitionId 
          });
          
          // 删除阶段数据
          await queryInterface.bulkDelete("competition_stages", { 
            competition_id: competitionId 
          });
          
          // 删除报名数据
          await queryInterface.bulkDelete("registrations", { 
            competition_id: competitionId 
          });
          
          // 删除比赛数据
          await queryInterface.bulkDelete("competitions", { 
            id: competitionId 
          });
          
          console.log(`已删除比赛: ${competition.title}, ID: ${competitionId}`);
        }
      }
      
      // 删除用户数据
      await queryInterface.bulkDelete("users", { 
        username: { [Sequelize.Op.like]: 'player\\_%\\_%' }
      });
      
      await queryInterface.bulkDelete("users", { 
        username: { [Sequelize.Op.like]: 'judge\\_%' }
      });
      
      console.log('种子数据清除成功！');
    } catch (error) {
      console.error('种子数据清除失败:', error);
      throw error;
    }
  }
}; 