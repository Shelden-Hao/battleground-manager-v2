const db = require("../models");
const Match = db.Match;
const User = db.User;
const Group = db.Group;
const Score = db.Score;
const GroupPlayer = db.GroupPlayer;
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// 获取比赛列表
const getMatches = async (req, res) => {
  try {
    const filters = {};
    
    // 过滤条件
    if (req.query.competition_id) {
      filters.competition_id = req.query.competition_id;
    }
    if (req.query.stage_id) {
      filters.stage_id = req.query.stage_id;
    }
    if (req.query.group_id) {
      filters.group_id = req.query.group_id;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    // 如果是选手，只显示自己参与的比赛
    if (req.user && req.user.role === "player") {
      filters[Op.or] = [
        { player1_id: req.user.id },
        { player2_id: req.user.id },
      ];
    }

    const matches = await Match.findAll({
      where: filters,
      include: [
        {
          model: User,
          as: "player1",
          attributes: ["id", "username", "name"],
        },
        {
          model: User,
          as: "player2",
          attributes: ["id", "username", "name"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["scheduled_time", "ASC"]],
    });

    res.json(matches);
  } catch (error) {
    console.error("获取比赛列表失败:", error);
    res.status(500).json({ message: "获取比赛列表失败", error });
  }
};

// 获取单个比赛
const getMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "player1",
          attributes: ["id", "username", "name"],
        },
        {
          model: User,
          as: "player2",
          attributes: ["id", "username", "name"],
        },
        {
          model: User,
          as: "winner",
          attributes: ["id", "username", "name"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
        {
          model: Score,
          as: "scores",
          include: [
            {
              model: User,
              as: "judge",
              attributes: ["id", "username", "name"],
            },
          ],
        },
      ],
    });

    if (!match) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    res.json(match);
  } catch (error) {
    console.error("获取比赛信息失败:", error);
    res.status(500).json({ message: "获取比赛信息失败", error });
  }
};

// 创建比赛
const createMatch = async (req, res) => {
  try {
    const {
      competition_id,
      stage_id,
      group_id,
      player1_id,
      player2_id,
      scheduled_time,
    } = req.body;

    const match = await Match.create({
      competition_id,
      stage_id,
      group_id,
      player1_id,
      player2_id,
      scheduled_time,
      status: "pending",
      player1_score: 0,
      player2_score: 0,
    });

    res.status(201).json({
      message: "创建比赛成功",
      match,
    });
  } catch (error) {
    console.error("创建比赛失败:", error);
    res.status(500).json({ message: "创建比赛失败" });
  }
};

// 更新比赛
const updateMatch = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const match = await Match.findByPk(req.params.id, { transaction: t });
    if (!match) {
      await t.rollback();
      return res.status(404).json({ message: "比赛不存在" });
    }

    // 更新比赛信息
    await match.update(req.body, { transaction: t });

    // 如果比赛状态改为已完成，确定获胜者
    if (req.body.status === "completed") {
      let winnerId = null;
      if (match.player1_score > match.player2_score) {
        winnerId = match.player1_id;
      } else if (match.player2_score > match.player2_score) {
        winnerId = match.player2_id;
      }
      
      // 更新获胜者ID
      await match.update({ winner_id: winnerId }, { transaction: t });
      
      // 如果是小组赛，更新选手积分和排名
      if (match.group_id) {
        // 获取player1的总得分
        const player1Scores = await Score.findAll({
          where: {
            match_id: match.id,
            player_id: match.player1_id,
          },
          transaction: t,
        });
        
        const player1TotalScore = player1Scores.reduce((sum, score) => sum + parseFloat(score.score), 0) / 
          (player1Scores.length || 1);
        
        // 获取player2的总得分
        const player2Scores = await Score.findAll({
          where: {
            match_id: match.id,
            player_id: match.player2_id,
          },
          transaction: t,
        });
        
        const player2TotalScore = player2Scores.reduce((sum, score) => sum + parseFloat(score.score), 0) / 
          (player2Scores.length || 1);
        
        // 更新比赛选手得分
        await match.update({
          player1_score: player1TotalScore,
          player2_score: player2TotalScore,
        }, { transaction: t });
        
        // 获取小组中的选手
        const player1GroupPlayer = await GroupPlayer.findOne({
          where: {
            group_id: match.group_id,
            player_id: match.player1_id,
          },
          transaction: t,
        });
        
        const player2GroupPlayer = await GroupPlayer.findOne({
          where: {
            group_id: match.group_id,
            player_id: match.player2_id,
          },
          transaction: t,
        });
        
        // 更新小组选手总分
        if (player1GroupPlayer) {
          await player1GroupPlayer.update({
            points: sequelize.literal(`points + ${Math.round(player1TotalScore)}`),
          }, { transaction: t });
        }
        
        if (player2GroupPlayer) {
          await player2GroupPlayer.update({
            points: sequelize.literal(`points + ${Math.round(player2TotalScore)}`),
          }, { transaction: t });
        }
        
        // 更新小组排名
        const groupPlayers = await GroupPlayer.findAll({
          where: {
            group_id: match.group_id,
          },
          order: [["points", "DESC"]],
          transaction: t,
        });
        
        // 按分数降序更新排名
        for (let i = 0; i < groupPlayers.length; i++) {
          await groupPlayers[i].update({
            rank: i + 1,
          }, { transaction: t });
        }
      }
    }
    
    await t.commit();
    res.json({
      message: "更新比赛成功",
      match,
    });
  } catch (error) {
    await t.rollback();
    console.error("更新比赛失败:", error);
    res.status(500).json({ message: "更新比赛失败" });
  }
};

// 删除比赛
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    await match.destroy();
    res.json({ message: "删除比赛成功" });
  } catch (error) {
    console.error("删除比赛失败:", error);
    res.status(500).json({ message: "删除比赛失败" });
  }
};

// 获取我的比赛
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { player1_id: req.user.id },
          { player2_id: req.user.id },
        ],
      },
      include: [
        {
          model: User,
          as: "player1",
          attributes: ["id", "username", "name"],
        },
        {
          model: User,
          as: "player2",
          attributes: ["id", "username", "name"],
        },
      ],
      order: [["scheduled_time", "ASC"]],
    });

    res.json(matches);
  } catch (error) {
    console.error("获取我的比赛失败:", error);
    res.status(500).json({ message: "获取我的比赛失败" });
  }
};

// 获取待评分的比赛（裁判）
const getMatchesToJudge = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is a judge
    if (user.role !== "judge") {
      return res.status(403).json({
        message: "Access denied. User is not a judge.",
      });
    }

    // Get matches that are currently in progress
    const matches = await Match.findAll({
      where: {
        status: "in_progress",
      },
      include: [
        {
          model: User,
          as: "player1",
          attributes: ["id", "username", "name"],
        },
        {
          model: User,
          as: "player2",
          attributes: ["id", "username", "name"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).json(matches);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving matches to judge", error });
  }
};

module.exports = {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  getMyMatches,
  getMatchesToJudge,
}; 