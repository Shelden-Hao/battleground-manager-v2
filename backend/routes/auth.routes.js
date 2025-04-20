const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [认证]
 *     summary: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               name:
 *                 type: string
 *                 description: 姓名
 *               role:
 *                 type: string
 *                 enum: [player, judge]
 *                 description: 角色（选手或裁判）
 *               phone:
 *                 type: string
 *                 description: 电话
 *               email:
 *                 type: string
 *                 description: 邮箱
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [认证]
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         description: 认证失败
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [认证]
 *     summary: 获取当前用户信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *       401:
 *         description: 未认证
 */
router.get("/me", verifyToken, authController.getCurrentUser);

module.exports = router;
