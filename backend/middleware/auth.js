const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 验证JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "未提供认证令牌" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "用户不存在" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "无效的认证令牌" });
  }
};

// 检查用户角色
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "没有权限访问此资源" });
    }
    next();
  };
};

// 检查是否为管理员
const isAdmin = checkRole(["admin"]);

// 检查是否为裁判
const isJudge = checkRole(["judge"]);

// 检查是否为选手
const isPlayer = checkRole(["player"]);

// 检查是否为本人或管理员
const isSelfOrAdmin = async (req, res, next) => {
  const userId = parseInt(req.params.userId || req.params.id);
  if (req.user.role === "admin" || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ message: "没有权限访问此资源" });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  isAdmin,
  isJudge,
  isPlayer,
  isSelfOrAdmin,
};
