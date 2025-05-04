const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// 允許跨來源請求（CORS）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// 查詢食物是否為低渣食物
app.get('/api/search', (req, res) => {
  const foodName = req.query.name;
  if (!foodName) {
    return res.status(400).json({ error: '請提供食物名稱' });
  }

  const dataPath = path.join(__dirname, 'foodData.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: '無法讀取資料' });
    }

    const foods = JSON.parse(data);
    const result = foods.find(
      (item) => item.name.toLowerCase() === foodName.toLowerCase()
    );

    if (result) {
      res.json(result);
    } else {
      res.json({ name: foodName, allowed: false, note: '資料庫中無此食物資訊' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`伺服器正在 http://localhost:${PORT} 上運行`);
});