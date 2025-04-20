const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const { verifyToken, isAdmin, isJudge } = require("../middleware/auth");

/**
 * @swagger
 * /api/matches:
 *   get:
 *     tags: [比赛]
 *     summary: 获取比赛列表
 *     parameters:
 *       - in: query
 *         name: competition_id
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *       - in: query
 *         name: stage_id
 *         schema:
 *           type: integer
 *         description: 阶段ID
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: integer
 *         description: 小组ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *         description: 比赛状态
 *     responses:
 *       200:
 *         description: 成功获取比赛列表
 */
router.get("/", matchController.getMatches);

/**
 * @swagger
 * /api/matches/my:
 *   get:
 *     tags: [比赛]
 *     summary: 获取我的比赛
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取我的比赛
 */
router.get("/my", verifyToken, matchController.getMyMatches);

/**
 * @swagger
 * /api/matches/to-judge:
 *   get:
 *     tags: [比赛]
 *     summary: 获取待评分的比赛（裁判）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取待评分比赛
 *       403:
 *         description: 权限不足
 */
router.get("/to-judge", verifyToken, isJudge, matchController.getMatchesToJudge);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     tags: [比赛]
 *     summary: 获取单个比赛详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 成功获取比赛详情
 *       404:
 *         description: 比赛不存在
 */
router.get("/:id", matchController.getMatch);

/**
 * @swagger
 * /api/matches:
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
 *               - competition_id
 *               - stage_id
 *               - player1_id
 *               - player2_id
 *             properties:
 *               competition_id:
 *                 type: integer
 *                 description: 比赛ID
 *               stage_id:
 *                 type: integer
 *                 description: 阶段ID
 *               group_id:
 *                 type: integer
 *                 description: 小组ID
 *               player1_id:
 *                 type: integer
 *                 description: 选手1 ID
 *               player2_id:
 *                 type: integer
 *                 description: 选手2 ID
 *               scheduled_time:
 *                 type: string
 *                 format: date-time
 *                 description: 比赛时间
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isAdmin, matchController.createMatch);

/**
 * @swagger
 * /api/matches/{id}:
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
 *               scheduled_time:
 *                 type: string
 *                 format: date-time
 *                 description: 比赛时间
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *                 description: 比赛状态
 *               player1_score:
 *                 type: number
 *                 description: 选手1得分
 *               player2_score:
 *                 type: number
 *                 description: 选手2得分
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 比赛不存在
 */
router.put("/:id", verifyToken, isAdmin, matchController.updateMatch);

/**
 * @swagger
 * /api/matches/{id}:
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
router.delete("/:id", verifyToken, isAdmin, matchController.deleteMatch);

module.exports = router;
