let token = localStorage.getItem('admin_token') || '';

window.onload = () => {
  // 若已有 token，自動顯示後台功能
  if (token) {
    document.getElementById('adminPanel').style.display = 'block';
    loadFoods();
  }
};

// 登入函數
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('http://localhost:3000/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("登入失敗");
      return res.json();
    })
    .then(data => {
      token = data.token;
      localStorage.setItem('admin_token', token);
      document.getElementById('adminPanel').style.display = 'block';
      loadFoods();
    })
    .catch(err => alert(err.message));
}

// 傳回 Authorization header
function getAuthHeader() {
  return { Authorization: token };
}

// 載入所有食物資料
function loadFoods() {
  fetch('http://localhost:3000/admin/foods', {
    headers: getAuthHeader()
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) return throwLoginError();
        throw new Error("載入資料失敗");
      }
      return res.json();
    })
    .then(data => {
      const list = document.getElementById('foodList');
      list.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'food-item';
        div.innerHTML = `${item.name}（${item.allowed ? '可食用' : '不建議'}）<br>備註：${item.note}<br>
          <button onclick="deleteFood('${item.name}')">刪除</button>`;
        list.appendChild(div);
      });
    })
    .catch(err => console.error(err.message));
}

// 新增食物
function addFood() {
  const name = document.getElementById('name').value.trim();
  const note = document.getElementById('note').value.trim();
  const allowed = document.getElementById('allowed').value === 'true';

  if (!name) return alert("請輸入食物名稱");

  fetch('http://localhost:3000/admin/foods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ name, allowed, note })
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) return throwLoginError();
        throw new Error("新增失敗");
      }
      return res.json();
    })
    .then(() => {
      loadFoods();
      document.getElementById('name').value = '';
      document.getElementById('note').value = '';
    })
    .catch(err => alert(err.message));
}

// 刪除食物
function deleteFood(name) {
  fetch(`http://localhost:3000/admin/foods/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) return throwLoginError();
        throw new Error("刪除失敗");
      }
      return res.json();
    })
    .then(() => loadFoods())
    .catch(err => alert(err.message));
}

// token 過期或驗證失敗時的處理
function throwLoginError() {
  alert("登入逾時，請重新登入");
  localStorage.removeItem('admin_token');
  location.reload();
}
