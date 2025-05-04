let isLoggedIn = false;

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
  .then(() => {
    isLoggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';
    loadFoods();
  })
  .catch(err => alert(err.message));
}

function loadFoods() {
  fetch('http://localhost:3000/admin/foods')
    .then(res => res.json())
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
    });
}

function addFood() {
  const name = document.getElementById('name').value.trim();
  const note = document.getElementById('note').value.trim();
  const allowed = document.getElementById('allowed').value === 'true';

  fetch('http://localhost:3000/admin/foods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, allowed, note })
  })
  .then(res => res.json())
  .then(() => {
    loadFoods();
    document.getElementById('name').value = '';
    document.getElementById('note').value = '';
  });
}

function deleteFood(name) {
  fetch(`http://localhost:3000/admin/foods/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(() => loadFoods());
}
