const Score = require("../models/score");
const Match = require("../models/match");
const User = require("../models/user");
const { Op } = require("sequelize");

// 获取比赛的评分
const getMatchScores = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    
    const scores = await Score.findAll({
      where: { match_id: matchId },
      include: [
        {
          model: User,
          as: "judge",
          attributes: ["id", "name", "username"],
        },
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"],
        },
      ],
    });
    
    res.json(scores);
  } catch (error) {
    console.error("获取比赛评分失败:", error);
    res.status(500).json({ message: "获取比赛评分失败" });
  }
};

// 获取选手的所有评分
const getPlayerScores = async (req, res) => {
  try {
    const playerId = req.params.playerId || req.user.id;
    
    // 验证权限（只有管理员或本人可以查看）
    if (req.user.role !== "admin" && req.user.id !== parseInt(playerId)) {
      return res.status(403).json({ message: "没有权限查看其他选手的评分" });
    }
    
    const scores = await Score.findAll({
      where: { player_id: playerId },
      include: [
        {
          model: Match,
          as: "match",
        },
        {
          model: User,
          as: "judge",
          attributes: ["id", "name", "username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    
    res.json(scores);
  } catch (error) {
    console.error("获取选手评分失败:", error);
    res.status(500).json({ message: "获取选手评分失败" });
  }
};

// 获取裁判评分的历史
const getJudgeScores = async (req, res) => {
  try {
    // 只有管理员或裁判本人可以查看
    const judgeId = req.params.judgeId || req.user.id;
    
    if (req.user.role !== "admin" && req.user.id !== parseInt(judgeId)) {
      return res.status(403).json({ message: "没有权限查看其他裁判的评分历史" });
    }
    
    const scores = await Score.findAll({
      where: { judge_id: judgeId },
      include: [
        {
          model: Match,
          as: "match",
        },
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    
    res.json(scores);
  } catch (error) {
    console.error("获取裁判评分历史失败:", error);
    res.status(500).json({ message: "获取裁判评分历史失败" });
  }
};

// 创建评分
const createScore = async (req, res) => {
  try {
    const { match_id, player_id, score, comments } = req.body;
    
    // 验证是否为裁判
    if (req.user.role !== "judge" && req.user.role !== "admin") {
      return res.status(403).json({ message: "只有裁判可以评分" });
    }
    
    // 验证比赛是否存在
    const match = await Match.findByPk(match_id);
    if (!match) {
      return res.status(404).json({ message: "比赛不存在" });
    }
    
    // 验证选手是否参与该比赛
    if (match.player1_id !== player_id && match.player2_id !== player_id) {
      return res.status(400).json({ message: "该选手未参与此比赛" });
    }
    
    // 验证比赛状态
    if (match.status !== "IN_PROGRESS") {
      return res.status(400).json({ message: "只能对进行中的比赛进行评分" });
    }
    
    // 检查是否已经评过分
    const existingScore = await Score.findOne({
      where: {
        match_id,
        player_id,
        judge_id: req.user.id,
      },
    });
    
    if (existingScore) {
      return res.status(400).json({ message: "您已经对该选手评过分了" });
    }
    
    // 创建评分
    const newScore = await Score.create({
      match_id,
      player_id,
      judge_id: req.user.id,
      score,
      comments,
    });
    
    // 检查是否所有评分都已完成
    const allScoresSubmitted = await checkAllScoresSubmitted(match);
    if (allScoresSubmitted) {
      // 更新比赛状态为已完成
      await match.update({ status: "COMPLETED" });
    }
    
    res.status(201).json({
      message: "评分成功",
      score: newScore,
    });
  } catch (error) {
    console.error("创建评分失败:", error);
    res.status(500).json({ message: "创建评分失败" });
  }
};

// 更新评分
const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comments } = req.body;
    
    // 获取评分
    const scoreRecord = await Score.findByPk(id);
    if (!scoreRecord) {
      return res.status(404).json({ message: "评分记录不存在" });
    }
    
    // 验证权限（只有评分的裁判本人或管理员可以修改）
    if (req.user.role !== "admin" && req.user.id !== scoreRecord.judge_id) {
      return res.status(403).json({ message: "没有权限修改此评分" });
    }
    
    // 获取比赛
    const match = await Match.findByPk(scoreRecord.match_id);
    if (match.status === "COMPLETED") {
      return res.status(400).json({ message: "比赛已完成，不能修改评分" });
    }
    
    // 更新评分
    await scoreRecord.update({ score, comments });
    
    res.json({
      message: "更新评分成功",
      score: scoreRecord,
    });
  } catch (error) {
    console.error("更新评分失败:", error);
    res.status(500).json({ message: "更新评分失败" });
  }
};

// 删除评分
const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取评分
    const score = await Score.findByPk(id);
    if (!score) {
      return res.status(404).json({ message: "评分记录不存在" });
    }
    
    // 验证权限（只有评分的裁判本人或管理员可以删除）
    if (req.user.role !== "admin" && req.user.id !== score.judge_id) {
      return res.status(403).json({ message: "没有权限删除此评分" });
    }
    
    // 获取比赛
    const match = await Match.findByPk(score.match_id);
    if (match.status === "COMPLETED") {
      return res.status(400).json({ message: "比赛已完成，不能删除评分" });
    }
    
    await score.destroy();
    
    res.json({ message: "删除评分成功" });
  } catch (error) {
    console.error("删除评分失败:", error);
    res.status(500).json({ message: "删除评分失败" });
  }
};

// 辅助函数：检查比赛是否所有评分都已提交
const checkAllScoresSubmitted = async (match) => {
  // 要求所有裁判都对两位选手都进行了评分
  const judges = await User.findAll({ where: { role: "judge" } });
  
  // 如果没有裁判，返回false
  if (judges.length === 0) {
    return false;
  }
  
  // 检查每个裁判是否都对两位选手评分了
  for (const judge of judges) {
    const player1Score = await Score.findOne({
      where: {
        match_id: match.id,
        player_id: match.player1_id,
        judge_id: judge.id,
      },
    });
    
    const player2Score = await Score.findOne({
      where: {
        match_id: match.id,
        player_id: match.player2_id,
        judge_id: judge.id,
      },
    });
    
    // 如果任何一个裁判没有对任何一位选手评分，返回false
    if (!player1Score || !player2Score) {
      return false;
    }
  }
  
  // 所有裁判都对两位选手评分了
  return true;
};

module.exports = {
  getMatchScores,
  getPlayerScores,
  getJudgeScores,
  createScore,
  updateScore,
  deleteScore,
};
