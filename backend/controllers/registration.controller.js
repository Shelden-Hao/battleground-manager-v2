const db = require("../models");
const Registration = db.Registration;
const Competition = db.Competition;
const User = db.User;
const { Op } = require("sequelize");

// 获取所有报名信息（管理员）
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"],
        },
        {
          model: Competition,
          as: "competition",
          attributes: ["id", "title", "status"],
        },
      ],
    });
    res.json(registrations);
  } catch (error) {
    console.error("获取报名信息失败:", error);
    res.status(500).json({ message: "获取报名信息失败" });
  }
};

// 获取我的报名信息
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: {
        player_id: req.user.id,
      },
      include: [
        {
          model: Competition,
          as: "competition",
          attributes: ["id", "title", "status", "start_date", "end_date"],
        },
      ],
    });
    res.json(registrations);
  } catch (error) {
    console.error("获取个人报名信息失败:", error);
    res.status(500).json({ message: "获取个人报名信息失败" });
  }
};

// 获取特定比赛的所有报名信息
const getCompetitionRegistrations = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const competition = await Competition.findByPk(competitionId);
    
    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    const registrations = await Registration.findAll({
      where: {
        competition_id: competitionId,
      },
      include: [
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username", "email", "phone"],
        },
      ],
    });
    res.json(registrations);
  } catch (error) {
    console.error("获取比赛报名信息失败:", error);
    res.status(500).json({ message: "获取比赛报名信息失败" });
  }
};

// 创建报名
const createRegistration = async (req, res) => {
  try {
    const { competition_id } = req.body;
    const playerId = req.user.id;

    // 检查比赛是否存在
    const competition = await Competition.findByPk(competition_id);
    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    // 检查比赛状态
    if (competition.status !== "registration" && competition.status !== "in_progress") {
      return res.status(400).json({ message: "该比赛当前不接受报名" });
    }

    // 检查是否已经报名
    const existingRegistration = await Registration.findOne({
      where: {
        competition_id,
        player_id: playerId,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "您已经报名了此比赛" });
    }

    // 创建报名记录
    const registration = await Registration.create({
      competition_id,
      player_id: playerId,
      status: "pending", // 默认为待审核状态
    });

    res.status(201).json({
      message: "报名成功，等待审核",
      registration,
    });
  } catch (error) {
    console.error("报名失败:", error);
    res.status(500).json({ message: "报名失败" });
  }
};

// 更新报名状态（管理员）
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(404).json({ message: "报名记录不存在" });
    }

    // 更新报名状态
    await registration.update({ status });

    res.json({
      message: "报名状态更新成功",
      registration,
    });
  } catch (error) {
    console.error("更新报名状态失败:", error);
    res.status(500).json({ message: "更新报名状态失败" });
  }
};

// 取消报名
const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(404).json({ message: "报名记录不存在" });
    }

    // 检查权限：只允许管理员或报名的选手本人取消报名
    if (req.user.role !== "admin" && req.user.id !== registration.player_id) {
      return res.status(403).json({ message: "您没有权限取消此报名" });
    }

    // 检查比赛状态
    const competition = await Competition.findByPk(registration.competition_id);
    if (competition.status === "in_progress" || competition.status === "completed") {
      return res.status(400).json({ message: "比赛已开始或已结束，不能取消报名" });
    }

    await registration.destroy();
    res.json({ message: "报名已取消" });
  } catch (error) {
    console.error("取消报名失败:", error);
    res.status(500).json({ message: "取消报名失败" });
  }
};

module.exports = {
  getAllRegistrations,
  getMyRegistrations,
  getCompetitionRegistrations,
  createRegistration,
  updateRegistration,
  cancelRegistration,
};
