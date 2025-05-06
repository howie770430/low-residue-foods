const crypto = require('crypto');

// 設定帳密
const validUser = {
    username: 'howie770430',
    password: 'test1234',
  };
  
// 簡單憑證儲存區（記憶體中）
let activeTokens = [];

function login(req, res) {
  const { username, password } = req.body;
  if (username === validUser.username && password === validUser.password) {
    const token = crypto.randomBytes(16).toString('hex');
    activeTokens.push(token);
    res.json({ message: '登入成功', token });
  } else {
    res.status(401).json({ error: '帳號或密碼錯誤' });
  }
}

// 驗證 token 是否有效
function authorize(req, res, next) {
  const token = req.headers['authorization'];
  if (activeTokens.includes(token)) {
    next();
  } else {
    res.status(401).json({ error: '未授權，請重新登入' });
  }
}

module.exports = { login, authorize };