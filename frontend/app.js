document.getElementById('searchBtn').addEventListener('click', () => {
    const foodName = document.getElementById('foodInput').value.trim();
    if (!foodName) {
      alert('請輸入食物名稱');
      return;
    }
  
    fetch(`http://localhost:3000/api/search?name=${encodeURIComponent(foodName)}`)
      .then((response) => response.json())
      .then((data) => {
        const resultDiv = document.getElementById('result');
        if (data.allowed) {
          resultDiv.textContent = `${data.name}：可以食用。備註：${data.note}`;
        } else {
          resultDiv.textContent = `${data.name}：不建議食用。備註：${data.note}`;
        }
      })
      .catch((error) => {
        console.error('發生錯誤：', error);
      });
  });