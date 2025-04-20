const db = require("../models");
const Competition = db.Competition;
const Registration = db.Registration;
const CompetitionStage = db.CompetitionStage;
const Match = db.Match;
const Score = db.Score;
const User = db.User;
const Group = db.Group;
const GroupPlayer = db.GroupPlayer;
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// 获取比赛列表
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json(competitions);
  } catch (error) {
    console.error("获取比赛列表失败:", error);
    res.status(500).json({ message: "获取比赛列表失败" });
  }
};

// 获取单个比赛信息
const getCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByPk(req.params.id, {
      include: [
        {
          model: Registration,
          as: "registrations",
          include: [
            {
              model: User,
              as: "player",
              attributes: ["id", "name", "username"],
            },
          ],
        },
        {
          model: CompetitionStage,
          as: "stages",
          attributes: ["id", "name", "order", "type", "status"],
        },
      ],
    });

    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    res.json(competition);
  } catch (error) {
    console.error("获取比赛信息失败:", error);
    res.status(500).json({ message: "获取比赛信息失败" });
  }
};

// 创建比赛
const createCompetition = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;

    const competition = await Competition.create({
      title,
      description,
      start_date,
      end_date,
      status: "draft",
    });

    // 自动创建比赛的三个阶段：初赛、复赛、决赛
    await CompetitionStage.bulkCreate([
      {
        competition_id: competition.id,
        name: "初赛",
        type: "group",
        order: 1,
        status: "pending",
      },
      {
        competition_id: competition.id,
        name: "复赛",
        type: "knockout",
        order: 2,
        status: "pending",
      },
      {
        competition_id: competition.id,
        name: "决赛",
        type: "knockout",
        order: 3,
        status: "pending",
      },
    ]);

    res.status(201).json({
      message: "创建比赛成功",
      competition,
    });
  } catch (error) {
    console.error("创建比赛失败:", error);
    res.status(500).json({ message: "创建比赛失败" });
  }
};

// 更新比赛
const updateCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByPk(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    await competition.update(req.body);
    res.json({
      message: "更新比赛成功",
      competition,
    });
  } catch (error) {
    console.error("更新比赛失败:", error);
    res.status(500).json({ message: "更新比赛失败" });
  }
};

// 删除比赛
const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByPk(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "比赛不存在" });
    }

    await competition.destroy();
    res.json({ message: "删除比赛成功" });
  } catch (error) {
    console.error("删除比赛失败:", error);
    res.status(500).json({ message: "删除比赛失败" });
  }
};

// 生成32强对阵表
const generateTop32Matches = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const competitionId = req.params.id;
    
    // 获取比赛信息
    const competition = await Competition.findByPk(competitionId, { transaction: t });
    if (!competition) {
      await t.rollback();
      return res.status(404).json({ message: "比赛不存在" });
    }

    // 获取已批准的报名选手
    const registrations = await Registration.findAll({
      where: {
        competition_id: competitionId,
        status: "approved",
      },
      include: [
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"],
        },
      ],
      transaction: t,
    });

    // 检查报名选手数量
    if (registrations.length < 8) {
      await t.rollback();
      return res.status(400).json({ message: "报名选手不足，至少需要8名选手" });
    }

    // 获取初赛阶段ID
    const preliminaryStage = await CompetitionStage.findOne({
      where: {
        competition_id: competitionId,
        order: 1,
      },
      transaction: t,
    });

    if (!preliminaryStage) {
      await t.rollback();
      return res.status(404).json({ message: "未找到初赛阶段" });
    }

    // 更新初赛阶段状态为进行中
    await preliminaryStage.update({ status: "in_progress" }, { transaction: t });

    // 将选手分组（如果选手超过32人，取前32名；如果少于32人但多于16人，取前16名等）
    let playersToUse = registrations.map(reg => ({
      id: reg.player_id,
      name: reg.player.name,
      username: reg.player.username,
    }));

    // 确定使用的选手数量：32, 16, 8
    let playerCount = 32;
    if (playersToUse.length < 32) {
      playerCount = 16;
    }
    if (playersToUse.length < 16) {
      playerCount = 8;
    }

    // 如果选手数量超过我们要使用的数量，截取前N名
    playersToUse = playersToUse.slice(0, playerCount);

    // 创建组别
    const groupCount = 4; // 固定为4个组
    const playersPerGroup = playerCount / groupCount;
    
    const groups = [];
    for (let i = 0; i < groupCount; i++) {
      const group = await Group.create({
        competition_id: competitionId,
        stage_id: preliminaryStage.id,
        name: `${String.fromCharCode(65 + i)}组`, // A组, B组, C组, D组
      }, { transaction: t });
      groups.push(group);
    }

    // 将选手分配到各个组别
    for (let i = 0; i < playersToUse.length; i++) {
      const groupIndex = Math.floor(i / playersPerGroup);
      await GroupPlayer.create({
        group_id: groups[groupIndex].id,
        player_id: playersToUse[i].id,
      }, { transaction: t });
    }

    // 为每个组生成对阵表
    const matches = [];
    for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
      const groupId = groups[groupIndex].id;
      const groupPlayers = await GroupPlayer.findAll({
        where: { group_id: groupId },
        transaction: t,
      });

      // 每个选手都与组内其他选手对阵一次
      for (let i = 0; i < groupPlayers.length; i++) {
        for (let j = i + 1; j < groupPlayers.length; j++) {
          const match = await Match.create({
            competition_id: competitionId,
            stage_id: preliminaryStage.id,
            group_id: groupId,
            player1_id: groupPlayers[i].player_id,
            player2_id: groupPlayers[j].player_id,
            status: "pending",
            scheduled_time: new Date(Date.now() + (matches.length * 30 * 60 * 1000)), // 每场比赛间隔30分钟
            player1_score: 0,
            player2_score: 0,
          }, { transaction: t });
          matches.push(match);
        }
      }
    }

    await t.commit();
    res.json({
      message: "已成功生成初赛对阵表",
      groups,
      matches,
    });
  } catch (error) {
    await t.rollback();
    console.error("生成对阵表失败:", error);
    res.status(500).json({ message: "生成对阵表失败" });
  }
};

// 生成下一轮对阵表
const generateNextRoundMatches = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const competitionId = req.params.id;
    const { stageId } = req.body;
    
    // 验证比赛和阶段是否存在
    const competition = await Competition.findByPk(competitionId, { transaction: t });
    if (!competition) {
      await t.rollback();
      return res.status(404).json({ message: "比赛不存在" });
    }

    const currentStage = await CompetitionStage.findByPk(stageId, { transaction: t });
    if (!currentStage) {
      await t.rollback();
      return res.status(404).json({ message: "比赛阶段不存在" });
    }

    // 检查当前阶段的比赛是否都已完成
    const pendingMatches = await Match.count({
      where: {
        competition_id: competitionId,
        stage_id: stageId,
        status: { [Op.ne]: "completed" },
      },
      transaction: t,
    });

    if (pendingMatches > 0) {
      await t.rollback();
      return res.status(400).json({ message: "当前阶段还有未完成的比赛，无法生成下一轮" });
    }

    // 获取下一个阶段
    const nextStage = await CompetitionStage.findOne({
      where: {
        competition_id: competitionId,
        order: currentStage.order + 1,
      },
      transaction: t,
    });

    if (!nextStage) {
      await t.rollback();
      return res.status(400).json({ message: "已经是最后一个阶段，无法生成下一轮" });
    }

    // 更新当前阶段状态为已完成，下一阶段为进行中
    await currentStage.update({ status: "completed" }, { transaction: t });
    await nextStage.update({ status: "in_progress" }, { transaction: t });

    let selectedPlayers;

    // 如果是初赛->复赛（取每组前两名，共8强）
    if (currentStage.order === 1) {
      // 获取每个小组的成绩排名
      const groups = await Group.findAll({
        where: { 
          competition_id: competitionId,
          stage_id: stageId,
        },
        transaction: t,
      });

      // 收集每个组的前2名选手
      selectedPlayers = [];
      for (const group of groups) {
        const topPlayers = await GroupPlayer.findAll({
          where: { group_id: group.id },
          order: [
            ["points", "DESC"],
            ["id", "ASC"],
          ],
          limit: 2,
          transaction: t,
        });
        
        selectedPlayers.push(...topPlayers.map(p => p.player_id));
      }
    } 
    // 如果是复赛->决赛（取胜利的4强）
    else if (currentStage.order === 2) {
      // 获取复赛中所有比赛的胜利者
      const matches = await Match.findAll({
        where: {
          competition_id: competitionId,
          stage_id: stageId,
          status: "completed",
        },
        transaction: t,
      });

      selectedPlayers = matches.map(match => {
        return match.player1_score > match.player2_score ? match.player1_id : match.player2_id;
      });
    }

    // 生成对阵表（第一名对阵最后一名，第二名对阵倒数第二名...）
    const playerCount = selectedPlayers.length;
    const matches = [];

    for (let i = 0; i < playerCount / 2; i++) {
      const match = await Match.create({
        competition_id: competitionId,
        stage_id: nextStage.id,
        player1_id: selectedPlayers[i],
        player2_id: selectedPlayers[playerCount - 1 - i],
        status: "pending",
        scheduled_time: new Date(Date.now() + (i * 30 * 60 * 1000)),
        player1_score: 0,
        player2_score: 0,
      }, { transaction: t });
      matches.push(match);
    }

    await t.commit();
    res.json({
      message: `已成功生成${nextStage.name}对阵表`,
      matches,
    });
  } catch (error) {
    await t.rollback();
    console.error("生成下一轮对阵表失败:", error);
    res.status(500).json({ message: "生成下一轮对阵表失败" });
  }
};

// 获取比赛阶段信息
const getCompetitionStage = async (req, res) => {
  try {
    const { id, stageId } = req.params;
    
    // 验证比赛和阶段是否存在
    const stage = await CompetitionStage.findOne({
      where: {
        id: stageId,
        competition_id: id,
      },
      include: [
        {
          model: Match,
          as: "matches",
          include: [
            {
              model: User,
              as: "player1",
              attributes: ["id", "name", "username"],
            },
            {
              model: User,
              as: "player2",
              attributes: ["id", "name", "username"],
            },
            {
              model: Group,
              as: "group",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!stage) {
      return res.status(404).json({ message: "比赛阶段不存在" });
    }

    // 如果是初赛阶段，获取分组信息
    let groups = [];
    if (stage.order === 1) {
      groups = await Group.findAll({
        where: { 
          competition_id: id,
          stage_id: stageId,
        },
        include: [
          {
            model: GroupPlayer,
            as: "players",
            include: [
              {
                model: User,
                as: "player",
                attributes: ["id", "name", "username"],
              },
            ],
          },
        ],
      });
    }

    // 获取该阶段所有比赛的评分情况
    const matchIds = stage.matches.map(match => match.id);
    const scores = await Score.findAll({
      where: {
        match_id: { [Op.in]: matchIds },
      },
      include: [
        {
          model: User,
          as: "player",
          attributes: ["id", "name", "username"],
        },
        {
          model: User,
          as: "judge",
          attributes: ["id", "name", "username"],
        },
      ],
    });

    res.json({
      stage,
      groups,
      scores,
    });
  } catch (error) {
    console.error("获取比赛阶段信息失败:", error);
    res.status(500).json({ message: "获取比赛阶段信息失败" });
  }
};

module.exports = {
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  generateTop32Matches,
  generateNextRoundMatches,
  getCompetitionStage,
};
