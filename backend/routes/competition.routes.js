const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competition.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     tags: [比赛]
 *     summary: 获取所有比赛
 *     responses:
 *       200:
 *         description: 成功获取比赛列表
 */
router.get("/", competitionController.getCompetitions);

/**
 * @swagger
 * /api/competitions/{id}:
 *   get:
 *     tags: [比赛]
 *     summary: 获取单个比赛信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 成功获取比赛信息
 *       404:
 *         description: 比赛不存在
 */
router.get("/:id", competitionController.getCompetition);

/**
 * @swagger
 * /api/competitions:
 *   post:
 *     tags: [比赛]
 *     summary: 创建比赛
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *                 description: 比赛标题
 *               description:
 *                 type: string
 *                 description: 比赛描述
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: 开始日期
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: 结束日期
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isAdmin, competitionController.createCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   put:
 *     tags: [比赛]
 *     summary: 更新比赛
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 比赛标题
 *               description:
 *                 type: string
 *                 description: 比赛描述
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: 开始日期
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: 结束日期
 *               status:
 *                 type: string
 *                 enum: [draft, published, ongoing, completed]
 *                 description: 比赛状态
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 比赛不存在
 */
router.put("/:id", verifyToken, isAdmin, competitionController.updateCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   delete:
 *     tags: [比赛]
 *     summary: 删除比赛
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 比赛不存在
 */
router.delete("/:id", verifyToken, isAdmin, competitionController.deleteCompetition);

/**
 * @swagger
 * /api/competitions/{id}/generate-top32:
 *   post:
 *     tags: [比赛]
 *     summary: 生成32强对阵表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 生成成功
 *       400:
 *         description: 生成失败
 */
router.post("/:id/generate-top32", verifyToken, isAdmin, competitionController.generateTop32Matches);

/**
 * @swagger
 * /api/competitions/{id}/generate-next-round:
 *   post:
 *     tags: [比赛]
 *     summary: 生成下一轮对阵表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stageId
 *             properties:
 *               stageId:
 *                 type: integer
 *                 description: 当前阶段ID
 *     responses:
 *       200:
 *         description: 生成成功
 *       400:
 *         description: 生成失败
 */
router.post("/:id/generate-next-round", verifyToken, isAdmin, competitionController.generateNextRoundMatches);

/**
 * @swagger
 * /api/competitions/{id}/stage/{stageId}:
 *   get:
 *     tags: [比赛]
 *     summary: 获取比赛特定阶段信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 阶段ID
 *     responses:
 *       200:
 *         description: 成功获取阶段信息
 *       404:
 *         description: 阶段不存在
 */
router.get("/:id/stage/:stageId", competitionController.getCompetitionStage);

module.exports = router; 