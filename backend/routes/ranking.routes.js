const express = require("express");
const router = express.Router();
const rankingController = require("../controllers/ranking.controller");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/rankings/competition/{competitionId}:
 *   get:
 *     tags: [排名]
 *     summary: 获取比赛选手排名
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 成功获取选手排名
 *       404:
 *         description: 比赛不存在或无评分数据
 */
router.get("/competition/:competitionId", rankingController.getPlayerRankings);

/**
 * @swagger
 * /api/rankings/competition/{competitionId}/stage/{stageId}:
 *   get:
 *     tags: [排名]
 *     summary: 获取特定阶段的选手排名
 *     parameters:
 *       - in: path
 *         name: competitionId
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
 *         description: 成功获取选手排名
 *       404:
 *         description: 比赛或阶段不存在
 */
router.get("/competition/:competitionId/stage/:stageId", rankingController.getPlayerRankings);

/**
 * @swagger
 * /api/rankings/matchups/competition/{competitionId}/stage/{stageId}:
 *   get:
 *     tags: [排名]
 *     summary: 获取特定阶段的对战表
 *     parameters:
 *       - in: path
 *         name: competitionId
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
 *         description: 成功获取对战表
 *       404:
 *         description: 比赛或阶段不存在
 */
router.get("/matchups/competition/:competitionId/stage/:stageId", rankingController.getMatchups);

module.exports = router; 