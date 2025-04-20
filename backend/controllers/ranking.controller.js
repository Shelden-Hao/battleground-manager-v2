const db = require("../models");
const Score = db.Score;
const Match = db.Match;
const User = db.User;
const Competition = db.Competition;
const CompetitionStage = db.CompetitionStage;
const { Op } = require("sequelize");

// 获取选手排名
const getPlayerRankings = async (req, res) => {
  try {
    const { competitionId, stageId } = req.params;

    // 验证参数
    if (!competitionId) {
      return res.status(400).json({ message: "缺少必要参数: competitionId" });
    }

    // 查找比赛
    const competition = await Competition.findByPk(competitionId);
    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    // 查找阶段（如果提供了阶段ID）
    let stage;
    if (stageId) {
      stage = await CompetitionStage.findOne({
        where: { 
          id: stageId,
          competition_id: competitionId
        }
      });
      
      if (!stage) {
        return res.status(404).json({ message: "比赛阶段不存在" });
      }
    } else {
      // 查找比赛的第一个阶段（通常是资格赛或预选赛）
      stage = await CompetitionStage.findOne({
        where: { 
          competition_id: competitionId,
          order: 1  // 使用order字段查询第一个阶段，而不是根据type字段
        }
      });
      
      if (!stage) {
        return res.status(404).json({ message: "找不到比赛的第一个阶段" });
      }
    }

    // 查找该阶段的已完成比赛
    const qualificationMatch = await Match.findOne({
      where: { 
        competition_id: competitionId,
        stage_id: stage.id,
        status: "completed"
      }
    });

    if (!qualificationMatch) {
      return res.status(404).json({ message: "找不到已完成的比赛" });
    }

    // 获取所有参赛选手的评分
    const scores = await Score.findAll({
      where: { match_id: qualificationMatch.id },
      include: [
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"]
        },
        {
          model: User,
          as: "judge",
          attributes: ["id", "name", "username"]
        }
      ]
    });

    if (scores.length === 0) {
      return res.status(404).json({ message: "找不到选手评分数据" });
    }

    // 根据评分对选手进行排名
    const playerScores = scores.map(score => ({
      id: score.player_id,
      name: score.player.name,
      username: score.player.username,
      score: score.score,
      judge: {
        id: score.judge_id,
        name: score.judge.name
      },
      comments: score.comments
    }));

    // 按照分数降序排列
    const rankings = playerScores.sort((a, b) => b.score - a.score);

    // 添加排名字段
    const playersWithRank = rankings.map((player, index) => ({
      ...player,
      rank: index + 1
    }));

    res.json({
      competition: {
        id: competition.id,
        title: competition.title,
        status: competition.status
      },
      stage: {
        id: stage.id,
        name: stage.name,
        type: stage.type,
        status: stage.status
      },
      players: playersWithRank
    });
  } catch (error) {
    console.error('获取选手排名失败:', error);
    res.status(500).json({ message: '获取选手排名失败', error: error.message });
  }
};

// 获取对战表
const getMatchups = async (req, res) => {
  try {
    const { competitionId, stageId } = req.params;

    // 验证参数
    if (!competitionId || !stageId) {
      return res.status(400).json({ message: "缺少必要参数" });
    }

    // 查找比赛和阶段
    const [competition, stage] = await Promise.all([
      Competition.findByPk(competitionId),
      CompetitionStage.findOne({
        where: {
          id: stageId,
          competition_id: competitionId
        }
      })
    ]);

    console.log('competition', competition);
    console.log('stage', stage);

    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    if (!stage) {
      return res.status(404).json({ message: "比赛阶段不存在" });
    }

    // 获取该阶段的所有比赛
    const matches = await Match.findAll({
      where: {
        competition_id: competitionId,
        stage_id: stageId
      },
      include: [
        {
          model: User,
          as: "player1",
          attributes: ["id", "name", "username"]
        },
        {
          model: User,
          as: "player2",
          attributes: ["id", "name", "username"]
        }
      ],
      order: [["scheduled_time", "ASC"]]
    });

    if (matches.length === 0) {
      return res.status(404).json({ message: "找不到对战数据" });
    }

    // 如果是淘汰赛阶段，可能需要获取选手的资格赛成绩
    let playerScores = {};
    if (stage.type === "knockout") {
      // 获取第一阶段（资格赛/预选赛）
      const qualificationStage = await CompetitionStage.findOne({
        where: {
          competition_id: competitionId,
          order: 1
        }
      });

      if (qualificationStage) {
        // 获取资格赛比赛
        const qualificationMatch = await Match.findOne({
          where: {
            competition_id: competitionId,
            stage_id: qualificationStage.id,
            status: "completed"
          }
        });

        if (qualificationMatch) {
          // 获取选手评分
          const scores = await Score.findAll({
            where: { match_id: qualificationMatch.id }
          });

          // 构建选手ID到评分的映射
          playerScores = scores.reduce((acc, score) => {
            acc[score.player_id] = score.score;
            return acc;
          }, {});
        }
      }
    }

    // 构建对战数据
    const matchups = matches.map(match => ({
      id: match.id,
      scheduled_time: match.scheduled_time,
      status: match.status,
      stage: stage.name,
      player1: {
        id: match.player1_id,
        name: match.player1?.name || `选手${match.player1_id}`,
        username: match.player1?.username,
        score: match.player1_score,
        qualification_score: playerScores[match.player1_id] || null
      },
      player2: {
        id: match.player2_id,
        name: match.player2?.name || `选手${match.player2_id}`,
        username: match.player2?.username,
        score: match.player2_score,
        qualification_score: playerScores[match.player2_id] || null
      },
      winner_id: match.winner_id
    }));

    res.json({
      competition: {
        id: competition.id,
        title: competition.title,
        status: competition.status
      },
      stage: {
        id: stage.id,
        name: stage.name,
        type: stage.type,
        status: stage.status
      },
      matches: matchups
    });
  } catch (error) {
    console.error('获取对战表失败:', error);
    res.status(500).json({ message: '获取对战表失败', error: error.message });
  }
};

// 对外暴露的Controller方法
module.exports = {
  getPlayerRankings,
  getMatchups
}; 