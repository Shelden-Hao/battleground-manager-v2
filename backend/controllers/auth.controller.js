const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 用户注册
const register = async (req, res) => {
  try {
    const { username, password, name, phone, email, role } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 创建新用户
    const user = await User.create({
      username,
      password,
      name,
      phone,
      email,
      role: role || "player", // 默认角色为选手
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "注册成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("注册失败:", error);
    res.status(500).json({ message: "注册失败" });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "登录成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("登录失败:", error);
    res.status(500).json({ message: "登录失败" });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "name", "role", "phone", "email"],
    });
    res.json(user);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    res.status(500).json({ message: "获取用户信息失败" });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
