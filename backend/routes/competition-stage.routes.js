const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const CompetitionStage = require("../models/competition-stage");

/**
 * @swagger
 * /api/competition-stages:
 *   post:
 *     tags: [比赛阶段]
 *     summary: 创建比赛阶段
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
 *               - stage_name
 *               - stage_order
 *             properties:
 *               competition_id:
 *                 type: integer
 *                 description: 比赛ID
 *               stage_name:
 *                 type: string
 *                 description: 阶段名称
 *               stage_order:
 *                 type: integer
 *                 description: 阶段顺序
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const stage = await CompetitionStage.create(req.body);
    res.status(201).json(stage);
  } catch (error) {
    console.error("创建比赛阶段失败:", error);
    res.status(400).json({ message: "创建比赛阶段失败" });
  }
});

/**
 * @swagger
 * /api/competition-stages/{id}:
 *   get:
 *     tags: [比赛阶段]
 *     summary: 获取比赛阶段详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛阶段ID
 *     responses:
 *       200:
 *         description: 成功获取比赛阶段信息
 *       404:
 *         description: 比赛阶段不存在
 */
router.get("/:id", async (req, res) => {
  try {
    const stage = await CompetitionStage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: "比赛阶段不存在" });
    }
    res.json(stage);
  } catch (error) {
    console.error("获取比赛阶段失败:", error);
    res.status(500).json({ message: "获取比赛阶段失败" });
  }
});

/**
 * @swagger
 * /api/competition-stages/{id}:
 *   put:
 *     tags: [比赛阶段]
 *     summary: 更新比赛阶段
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛阶段ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage_name:
 *                 type: string
 *                 description: 阶段名称
 *               stage_order:
 *                 type: integer
 *                 description: 阶段顺序
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 description: 阶段状态
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 比赛阶段不存在
 */
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const stage = await CompetitionStage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: "比赛阶段不存在" });
    }
    await stage.update(req.body);
    res.json(stage);
  } catch (error) {
    console.error("更新比赛阶段失败:", error);
    res.status(400).json({ message: "更新比赛阶段失败" });
  }
});

/**
 * @swagger
 * /api/competition-stages/{id}:
 *   delete:
 *     tags: [比赛阶段]
 *     summary: 删除比赛阶段
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛阶段ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 比赛阶段不存在
 */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const stage = await CompetitionStage.findByPk(req.params.id);
    if (!stage) {
      return res.status(404).json({ message: "比赛阶段不存在" });
    }
    await stage.destroy();
    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除比赛阶段失败:", error);
    res.status(500).json({ message: "删除比赛阶段失败" });
  }
});

module.exports = router;
