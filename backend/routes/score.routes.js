const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");
const { verifyToken, isAdmin, isJudge } = require("../middleware/auth");

/**
 * @swagger
 * /api/scores/match/{matchId}:
 *   get:
 *     tags: [评分]
 *     summary: 获取比赛的所有评分
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 成功获取评分列表
 */
router.get("/match/:matchId", scoreController.getMatchScores);

/**
 * @swagger
 * /api/scores/player/{playerId}:
 *   get:
 *     tags: [评分]
 *     summary: 获取选手的所有评分
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 选手ID
 *     responses:
 *       200:
 *         description: 成功获取评分列表
 *       403:
 *         description: 无权查看该选手评分
 */
router.get("/player/:playerId", verifyToken, scoreController.getPlayerScores);

/**
 * @swagger
 * /api/scores/judge/{judgeId}:
 *   get:
 *     tags: [评分]
 *     summary: 获取裁判的评分历史
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: judgeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 裁判ID
 *     responses:
 *       200:
 *         description: 成功获取评分列表
 *       403:
 *         description: 无权查看该裁判评分
 */
router.get("/judge/:judgeId", verifyToken, scoreController.getJudgeScores);

/**
 * @swagger
 * /api/scores/my:
 *   get:
 *     tags: [评分]
 *     summary: 获取我的评分（选手可查看自己的所有评分，裁判可查看自己评的所有分）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取评分列表
 */
router.get("/my", verifyToken, (req, res) => {
  if (req.user.role === "player") {
    return scoreController.getPlayerScores(req, res);
  } else if (req.user.role === "judge") {
    return scoreController.getJudgeScores(req, res);
  } else {
    return res.status(403).json({ message: "无权限访问" });
  }
});

/**
 * @swagger
 * /api/scores:
 *   post:
 *     tags: [评分]
 *     summary: 创建评分（裁判）
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - match_id
 *               - player_id
 *               - score
 *             properties:
 *               match_id:
 *                 type: integer
 *                 description: 比赛ID
 *               player_id:
 *                 type: integer
 *                 description: 选手ID
 *               score:
 *                 type: number
 *                 description: 分数（0-100）
 *               comments:
 *                 type: string
 *                 description: 评价
 *     responses:
 *       201:
 *         description: 评分成功
 *       400:
 *         description: 请求参数错误
 *       403:
 *         description: 权限不足
 */
router.post("/", verifyToken, isJudge, scoreController.createScore);

/**
 * @swagger
 * /api/scores/{id}:
 *   put:
 *     tags: [评分]
 *     summary: 更新评分
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 评分ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 description: 分数（0-100）
 *               comments:
 *                 type: string
 *                 description: 评价
 *     responses:
 *       200:
 *         description: 更新成功
 *       400:
 *         description: 请求参数错误
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 评分不存在
 */
router.put("/:id", verifyToken, scoreController.updateScore);

/**
 * @swagger
 * /api/scores/{id}:
 *   delete:
 *     tags: [评分]
 *     summary: 删除评分
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 评分ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 评分不存在
 */
router.delete("/:id", verifyToken, scoreController.deleteScore);

module.exports = router;
