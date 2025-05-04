// auth.js：處理簡單帳密驗證
const validUser = {
    username: 'howie770430',
    password: 'iris1211',
  };
  
  function authenticate(req, res, next) {
    const { username, password } = req.body;
  
    if (username === validUser.username && password === validUser.password) {
      next(); // 驗證通過
    } else {
      res.status(401).json({ error: '帳號或密碼錯誤' });
    }
  }
  
  module.exports = { authenticate };