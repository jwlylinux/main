const express = require("express");
const cors = require("cors");
const path = require("path");
const { setEnvVariable, ChatCompletion } = require("@baiducloud/qianfan");
//const { init: initDB } = require("./db"); // 假设你有一个 `db.js` 文件进行数据库初始化

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// 设置百度文心千帆的环境变量
setEnvVariable('QIANFAN_AK', 'j0o1cQEo3gBbDAmXvJ7x61sE');
setEnvVariable('QIANFAN_SK', 'tWxvmiLWCwTrlJ0Chq8OxymKUq52etHS');

// 创建 ChatCompletion 实例
const client = new ChatCompletion();

// 首页 - 提供简单的表单页面
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 百度文心千帆 API 调用
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await client.chat({
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    }, 'ERNIE-3.5-8K');

    res.send({
      code: 0,
      data: response.data,
    });
  } catch (error) {
    res.status(500).send({
      code: 1,
      message: error.toString(),
    });
  }
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB(); // 初始化数据库
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();

