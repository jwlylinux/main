const express = require("express");
const cors = require("cors");
const path = require("path");
const { ChatCompletion, setEnvVariable } = require("@baiducloud/qianfan");
const { init: initDB } = require("./db");  // 引入数据库初始化函数

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// 百度文心千帆 API 配置
setEnvVariable('QIANFAN_ACCESS_KEY', 'j0o1cQEo3gBbDAmXvJ7x61sEj0o1cQEo3gBbDAmXvJ7x61sE');  // 替换为你的 Access Key
setEnvVariable('QIANFAN_SECRET_KEY', 'tWxvmiLWCwTrlJ0Chq8OxymKUq52etHS');  // 替换为你的 Secret Key

const client = new ChatCompletion();

// 调用百度文心千帆 API 路由
app.post("/api/ask", async (req, res) => {
  const { question, role } = req.body;

  try {
    const resp = await client.chat({
        messages: [
            {
                role: role || 'user',  // 使用传入的角色或默认角色
                content: question,
            },
        ],
    }, 'ERNIE-3.5-8K');

    res.send({
      code: 0,
      data: resp,
    });
  } catch (error) {
    res.status(500).send({
      code: 1,
      message: error.toString(),
    });
  }
});

// 微信小程序调用，获取微信 OpenID 路由
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  } else {
    res.status(400).send({ code: 1, message: "Invalid request source" });
  }
});

// 首页 - 提供简单的表单页面
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();  // 初始化数据库
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();

