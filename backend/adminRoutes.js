// adminRoutes.js：後台 API（CRUD）
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { authenticate } = require('./auth');

const dataPath = path.join(__dirname, 'foodData.json');

// 登入驗證（POST /admin/login）
router.post('/login', authenticate, (req, res) => {
  res.json({ message: '登入成功' });
});

// 取得所有食物資料（GET /admin/foods）
router.get('/foods', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '讀取資料失敗' });
    res.json(JSON.parse(data));
  });
});

// 新增食物（POST /admin/foods）
router.post('/foods', (req, res) => {
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

// 刪除食物（DELETE /admin/foods/:name）
router.delete('/foods/:name', (req, res) => {
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