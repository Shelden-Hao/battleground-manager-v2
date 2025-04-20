const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const Group = require("../models/group");
const GroupPlayer = require("../models/group-player");
const User = require("../models/user");

/**
 * @swagger
 * /api/groups:
 *   post:
 *     tags: [分组管理]
 *     summary: 创建比赛分组
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - competition_id
 *               - stage_id
 *               - name
 *             properties:
 *               competition_id:
 *                 type: integer
 *                 description: 比赛ID
 *               stage_id:
 *                 type: integer
 *                 description: 阶段ID
 *               name:
 *                 type: string
 *                 description: 分组名称
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    console.error("创建分组失败:", error);
    res.status(400).json({ message: "创建分组失败" });
  }
});

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     tags: [分组管理]
 *     summary: 获取分组详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分组ID
 *     responses:
 *       200:
 *         description: 成功获取分组信息
 *       404:
 *         description: 分组不存在
 */
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "players",
          through: { attributes: ["rank", "points"] },
          attributes: ["id", "username", "name"],
        },
      ],
    });
    if (!group) {
      return res.status(404).json({ message: "分组不存在" });
    }
    res.json(group);
  } catch (error) {
    console.error("获取分组失败:", error);
    res.status(500).json({ message: "获取分组失败" });
  }
});

/**
 * @swagger
 * /api/groups/{id}/players:
 *   post:
 *     tags: [分组管理]
 *     summary: 添加选手到分组
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分组ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player_ids
 *             properties:
 *               player_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 选手ID列表
 *     responses:
 *       200:
 *         description: 添加成功
 *       404:
 *         description: 分组不存在
 */
router.post("/:id/players", verifyToken, isAdmin, async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "分组不存在" });
    }

    const { player_ids } = req.body;
    const groupPlayers = player_ids.map((player_id) => ({
      group_id: group.id,
      player_id,
    }));

    await GroupPlayer.bulkCreate(groupPlayers);
    res.json({ message: "选手添加成功" });
  } catch (error) {
    console.error("添加选手失败:", error);
    res.status(400).json({ message: "添加选手失败" });
  }
});

/**
 * @swagger
 * /api/groups/{id}/players/{playerId}:
 *   put:
 *     tags: [分组管理]
 *     summary: 更新选手分组信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分组ID
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 选手ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rank:
 *                 type: integer
 *                 description: 排名
 *               points:
 *                 type: integer
 *                 description: 积分
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 分组或选手不存在
 */
router.put("/:id/players/:playerId", verifyToken, isAdmin, async (req, res) => {
  try {
    const groupPlayer = await GroupPlayer.findOne({
      where: {
        group_id: req.params.id,
        player_id: req.params.playerId,
      },
    });

    if (!groupPlayer) {
      return res.status(404).json({ message: "分组中不存在该选手" });
    }

    await groupPlayer.update(req.body);
    res.json(groupPlayer);
  } catch (error) {
    console.error("更新选手分组信息失败:", error);
    res.status(400).json({ message: "更新选手分组信息失败" });
  }
});

/**
 * @swagger
 * /api/groups/{id}/players/{playerId}:
 *   delete:
 *     tags: [分组管理]
 *     summary: 从分组中移除选手
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分组ID
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 选手ID
 *     responses:
 *       200:
 *         description: 移除成功
 *       404:
 *         description: 分组或选手不存在
 */
router.delete(
  "/:id/players/:playerId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const result = await GroupPlayer.destroy({
        where: {
          group_id: req.params.id,
          player_id: req.params.playerId,
        },
      });

      if (result === 0) {
        return res.status(404).json({ message: "分组中不存在该选手" });
      }

      res.json({ message: "选手移除成功" });
    } catch (error) {
      console.error("移除选手失败:", error);
      res.status(500).json({ message: "移除选手失败" });
    }
  }
);

module.exports = router;
