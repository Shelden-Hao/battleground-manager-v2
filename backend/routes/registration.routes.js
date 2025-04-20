const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration.controller");
const { verifyToken, isAdmin, isPlayer } = require("../middleware/auth");

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     tags: [报名]
 *     summary: 获取所有报名信息（管理员）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取报名列表
 */
router.get("/", verifyToken, isAdmin, registrationController.getAllRegistrations);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     tags: [报名]
 *     summary: 获取当前用户的报名信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取报名列表
 */
router.get("/my", verifyToken, registrationController.getMyRegistrations);

/**
 * @swagger
 * /api/registrations/competition/{competitionId}:
 *   get:
 *     tags: [报名]
 *     summary: 获取特定比赛的所有报名信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: competitionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 比赛ID
 *     responses:
 *       200:
 *         description: 成功获取报名列表
 */
router.get("/competition/:competitionId", verifyToken, registrationController.getCompetitionRegistrations);

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     tags: [报名]
 *     summary: 创建报名
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
 *             properties:
 *               competition_id:
 *                 type: integer
 *                 description: 比赛ID
 *     responses:
 *       201:
 *         description: 报名成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isPlayer, registrationController.createRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   put:
 *     tags: [报名]
 *     summary: 更新报名状态（管理员）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 报名ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: 报名状态
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 报名不存在
 */
router.put("/:id", verifyToken, isAdmin, registrationController.updateRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     tags: [报名]
 *     summary: 取消报名
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 报名ID
 *     responses:
 *       200:
 *         description: 取消成功
 *       404:
 *         description: 报名不存在
 */
router.delete("/:id", verifyToken, registrationController.cancelRegistration);

module.exports = router; 