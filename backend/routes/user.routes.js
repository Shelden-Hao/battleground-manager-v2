const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [用户]
 *     summary: 获取用户列表（管理员）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, judge, player]
 *         description: 筛选角色
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *       401:
 *         description: 未授权
 */
router.get("/", verifyToken, isAdmin, userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [用户]
 *     summary: 获取用户详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *       404:
 *         description: 用户不存在
 */
router.get("/:id", verifyToken, userController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [用户]
 *     summary: 创建用户（管理员）
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               name:
 *                 type: string
 *                 description: 真实姓名
 *               email:
 *                 type: string
 *                 description: 电子邮箱
 *               phone:
 *                 type: string
 *                 description: 电话号码
 *               role:
 *                 type: string
 *                 enum: [admin, judge, player]
 *                 description: 用户角色
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post("/", verifyToken, isAdmin, userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [用户]
 *     summary: 更新用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 真实姓名
 *               email:
 *                 type: string
 *                 description: 电子邮箱
 *               phone:
 *                 type: string
 *                 description: 电话号码
 *               role:
 *                 type: string
 *                 enum: [admin, judge, player]
 *                 description: 用户角色
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 用户不存在
 */
router.put("/:id", verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}/password:
 *   put:
 *     tags: [用户]
 *     summary: 修改密码
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: 旧密码
 *               newPassword:
 *                 type: string
 *                 description: 新密码
 *     responses:
 *       200:
 *         description: 修改成功
 *       400:
 *         description: 旧密码错误
 *       404:
 *         description: 用户不存在
 */
router.put("/:id/password", verifyToken, userController.changePassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [用户]
 *     summary: 删除用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 用户不存在
 */
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

module.exports = router; 