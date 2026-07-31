// 饮食模块
const DietModule = {
  currentMealType: null,

  init() {
    this.renderMeals();
    this.renderWater();
    this.renderWeightChart();
    this.setupFileInput();
    this.updateDateLabel();
  },

  updateDateLabel() {
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('diet-date-label').textContent =
      `${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
  },

  setupFileInput() {
    const input = document.getElementById('meal-file-input');
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoData = event.target.result;
          Storage.saveMealPhoto(Storage.today(), this.currentMealType, photoData);
          this.renderMeals();
          showToast('照片已保存');
        };
        reader.readAsDataURL(file);
      }
    });
  },

  uploadMeal(mealType) {
    this.currentMealType = mealType;
    document.getElementById('meal-file-input').click();
  },

  renderMeals() {
    const meals = Storage.getMealsByDate(Storage.today());
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
      const card = document.getElementById(`meal-${type}`);
      const photo = document.getElementById(`meal-photo-${type}`);
      if (meals[type]) {
        photo.src = meals[type];
        card.classList.add('meal-has-photo');
      } else {
        photo.src = '';
        card.classList.remove('meal-has-photo');
      }
    });
  },

  // ===== 喝水 =====
  renderWater() {
    const count = Storage.getWater(Storage.today());
    document.getElementById('water-count').textContent = count;

    const cupsContainer = document.getElementById('water-cups');
    cupsContainer.innerHTML = '';
    const cupSize = 200;
    const totalCups = 10; // 2000ml / 200ml = 10杯
    const filledCups = Math.floor(count / cupSize);

    for (let i = 0; i < totalCups; i++) {
      const cup = document.createElement('div');
      cup.className = 'water-cup' + (i < filledCups ? ' filled' : '');
      cupsContainer.appendChild(cup);
    }
  },

  addWater(amount) {
    const current = Storage.getWater(Storage.today());
    const newAmount = Math.min(current + amount, 3000);
    Storage.setWater(Storage.today(), newAmount);
    this.renderWater();

    if (newAmount >= 2000 && current < 2000) {
      showToast('今日饮水目标已达成！💧');
    }
  },

  resetWater() {
    Storage.setWater(Storage.today(), 0);
    this.renderWater();
    showToast('已重置');
  },

  // ===== 体重 =====
  saveWeight() {
    const input = document.getElementById('weight-input');
    const weight = parseFloat(input.value);
    if (!weight || weight <= 0) {
      showToast('请输入有效体重');
      return;
    }
    Storage.saveWeight(Storage.today(), weight);
    input.value = '';
    this.renderWeightChart();
    showToast('体重已记录');
  },

  renderWeightChart() {
    const weights = Storage.getWeights();
    const canvas = document.getElementById('weight-chart');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 显示最近7条记录
    const recent = weights.slice(-7);

    // 显示最新体重
    if (weights.length > 0) {
      const latest = weights[weights.length - 1];
      const prev = weights.length > 1 ? weights[weights.length - 2] : null;
      let changeText = `${latest.weight} kg`;
      if (prev) {
        const diff = latest.weight - prev.weight;
        if (diff !== 0) {
          changeText += ` (${diff > 0 ? '+' : ''}${diff.toFixed(1)}kg)`;
        }
      }
      document.getElementById('weight-latest').textContent = changeText;
    } else {
      document.getElementById('weight-latest').textContent = '尚无记录，开始记录吧';
    }

    if (recent.length < 2) {
      // 至少需要2个点才能画线
      ctx.fillStyle = '#B5A99A';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('记录2次以上显示趋势', W / 2, H / 2);
      return;
    }

    // 计算范围
    const minW = Math.min(...recent.map(w => w.weight)) - 1;
    const maxW = Math.max(...recent.map(w => w.weight)) + 1;
    const range = maxW - minW || 1;

    // 边距
    const padding = { top: 20, right: 20, bottom: 20, left: 30 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    // 画 Y 轴刻度
    ctx.strokeStyle = '#E8DDC9';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      // 刻度值
      const value = maxW - (range / 4) * i;
      ctx.fillStyle = '#B5A99A';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 4, y + 3);
    }

    // 画折线
    ctx.strokeStyle = '#8BA888';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const points = recent.map((w, i) => {
      const x = padding.left + (chartW / (recent.length - 1)) * i;
      const y = padding.top + chartH - ((w.weight - minW) / range) * chartH;
      return { x, y, weight: w.weight, date: w.date };
    });

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // 填充
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.lineTo(points[0].x, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(139, 168, 136, 0.12)';
    ctx.fill();

    // 画点
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#8BA888';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X 轴日期
    ctx.fillStyle = '#B5A99A';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    points.forEach(p => {
      const dateParts = p.date.split('-');
      ctx.fillText(`${dateParts[1]}/${dateParts[2]}`, p.x, H - 6);
    });
  },

  // ===== 首页状态 =====
  getHomeStatus() {
    const todayStr = Storage.today();
    const meals = Storage.getMealsByDate(todayStr);
    const water = Storage.getWater(todayStr);

    let parts = [];
    const mealCount = ['breakfast', 'lunch', 'dinner'].filter(m => meals[m]).length;
    if (mealCount > 0) parts.push(`三餐${mealCount}/3`);
    if (water > 0) parts.push(`水${water}ml`);

    return {
      text: parts.length > 0 ? parts.join(' · ') : '今日尚未记录',
      done: parts.length > 0
    };
  }
};

// 全局函数
function uploadMeal(type) { DietModule.uploadMeal(type); }
function addWater(amount) { DietModule.addWater(amount); }
function resetWater() { DietModule.resetWater(); }
function saveWeight() { DietModule.saveWeight(); }
