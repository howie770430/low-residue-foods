const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { login, authorize } = require('./auth');

const dataPath = path.join(__dirname, 'foodData.json');

// ✅ 登入（POST /admin/login）
router.post('/login', login);

// ✅ 以下操作皆需授權
router.get('/foods', authorize, (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '讀取資料失敗' });
    res.json(JSON.parse(data));
  });
});

router.post('/foods', authorize, (req, res) => {
  const { name, allowed, note } = req.body;
  if (!name) return res.status(400).json({ error: '名稱為必填' });

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '讀取資料失敗' });

    const foods = JSON.parse(data);
    foods.push({ name, allowed, note });
    fs.writeFile(dataPath, JSON.stringify(foods, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '寫入失敗' });
      res.json({ message: '新增成功' });
    });
  });
});

router.delete('/foods/:name', authorize, (req, res) => {
  const foodName = req.params.name;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '讀取資料失敗' });

    let foods = JSON.parse(data);
    const originalLength = foods.length;
    foods = foods.filter((item) => item.name !== foodName);

    if (foods.length === originalLength) {
      return res.status(404).json({ error: '找不到此食物' });
    }

    fs.writeFile(dataPath, JSON.stringify(foods, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '寫入失敗' });
      res.json({ message: '刪除成功' });
    });
  });
});

module.exports = router;
