const User = require("../models/user");
const bcrypt = require("bcryptjs");

// 获取用户列表
const getUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) {
      filters.role = req.query.role;
    }

    const users = await User.findAll({
      where: filters,
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    res.status(500).json({ message: "获取用户列表失败" });
  }
};

// 获取单个用户
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 检查权限：仅允许管理员或用户本人查看详情
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).json({ message: "无权访问此用户信息" });
    }

    res.json(user);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    res.status(500).json({ message: "获取用户信息失败" });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const { username, password, name, email, phone, role } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      role: role || "player", // 默认为选手
    });

    // 返回创建的用户（不包含密码）
    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      message: "用户创建成功",
      user: userData,
    });
  } catch (error) {
    console.error("创建用户失败:", error);
    res.status(500).json({ message: "创建用户失败" });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 检查权限：仅允许管理员或用户本人更新信息
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).json({ message: "无权更新此用户信息" });
    }

    // 如果不是管理员，不允许修改角色
    if (req.user.role !== "admin" && req.body.role) {
      delete req.body.role;
    }

    // 更新用户信息（不包括密码）
    const { password, ...updateData } = req.body;
    await user.update(updateData);

    // 返回更新后的用户信息（不包含密码）
    const userData = user.toJSON();
    delete userData.password;

    res.json({
      message: "用户信息更新成功",
      user: userData,
    });
  } catch (error) {
    console.error("更新用户信息失败:", error);
    res.status(500).json({ message: "更新用户信息失败" });
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 检查权限：仅允许用户本人或管理员修改密码
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).json({ message: "无权修改此用户密码" });
    }

    // 如果不是管理员，需要验证旧密码
    if (req.user.role !== "admin") {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "旧密码不正确" });
      }
    }

    // 加密新密码并更新
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: "密码修改成功" });
  } catch (error) {
    console.error("修改密码失败:", error);
    res.status(500).json({ message: "修改密码失败" });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    await user.destroy();
    res.json({ message: "用户删除成功" });
  } catch (error) {
    console.error("删除用户失败:", error);
    res.status(500).json({ message: "删除用户失败" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
};
