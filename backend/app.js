const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 添加路由日志中间件，用于调试
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "霹雳舞比赛管理系统 API",
      version: "1.0.0",
      description: "霹雳舞比赛管理系统的后端API文档",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "开发服务器",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
          name: "Authorization",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 原始swagger文档
app.get("/api", (req, res) => {
  res.json(swaggerSpec);
});

// 数据库连接
const sequelize = require("./config/database");
sequelize
  .authenticate()
  .then(() => console.log("数据库连接成功"))
  .catch((err) => console.error("数据库连接失败:", err));

// 路由配置
app.get("/", (req, res) => {
  res.json({ message: "欢迎使用霹雳舞比赛管理系统API" });
});
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/competitions", require("./routes/competition.routes"));
app.use("/api/competition-stages", require("./routes/competition-stage.routes"));
app.use("/api/registrations", require("./routes/registration.routes"));
app.use("/api/groups", require("./routes/group.routes"));
app.use("/api/matches", require("./routes/match.routes"));
app.use("/api/scores", require("./routes/score.routes"));
app.use("/api/rankings", require("./routes/ranking.routes"));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "服务器内部错误",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`API文档地址: http://localhost:${PORT}/api-docs`);
});
