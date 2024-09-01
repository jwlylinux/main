const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// 百度文心千帆 API 配置
const apiKey = 'j0o1cQEo3gBbDAmXvJ7x61sE';
const secretKey = 'tWxvmiLWCwTrlJ0Chq8OxymKUq52etHS';
const appId = '101171466';

// 获取 Access Token
async function getAccessToken() {
  const response = await axios.post('https://aip.baidubce.com/oauth/2.0/token', null, {
    params: {
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: secretKey,
    },
  });

  return response.data.access_token;
}

// 调用百度文心千帆 API
app.post("/api/ask", async (req, res) => {
  const { question, role } = req.body;

  try {
    const accessToken = await getAccessToken();
    
    const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ai_custom_model/v1/${appId}`, {
      question: question,
      role: role,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

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

// 首页 - 提供简单的表单页面
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

