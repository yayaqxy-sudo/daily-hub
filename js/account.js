// 记账模块
const AccountModule = {
  currentType: 'expense',
  currentCategory: null,

  // 分类定义
  categories: {
    expense: [
      { icon: '🍜', name: '餐饮' },
      { icon: '🛒', name: '超市' },
      { icon: '🚇', name: '交通' },
      { icon: '🛍️', name: '购物' },
      { icon: '🎬', name: '娱乐' },
      { icon: '💊', name: '医疗' },
      { icon: '🏠', name: '住房' },
      { icon: '💡', name: '其他' }
    ],
    income: [
      { icon: '💰', name: '工资' },
      { icon: '📈', name: '投资' },
      { icon: '🎁', name: '红包' },
      { icon: '💼', name: '兼职' },
      { icon: '📥', name: '其他' }
    ]
  },

  init() {
    this.renderCategories();
    this.renderSummary();
    this.renderLists();
    this.updateMonthLabel();
  },

  updateMonthLabel() {
    const now = new Date();
    document.getElementById('account-month-label').textContent =
      `${now.getFullYear()}年${now.getMonth() + 1}月`;
  },

  switchType(type) {
    this.currentType = type;
    this.currentCategory = null;
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    this.renderCategories();
  },

  renderCategories() {
    const grid = document.getElementById('category-grid');
    const cats = this.categories[this.currentType];
    grid.innerHTML = cats.map(c => `
      <div class="cat-item ${this.currentCategory === c.name ? 'active' : ''}"
           onclick="selectCategory('${c.name}')">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-name">${c.name}</span>
      </div>
    `).join('');
  },

  selectCategory(name) {
    this.currentCategory = name;
    this.renderCategories();
  },

  save() {
    const amount = parseFloat(document.getElementById('account-amount').value);
    const note = document.getElementById('account-note').value.trim();

    if (!amount || amount <= 0) {
      showToast('请输入金额');
      return;
    }
    if (!this.currentCategory) {
      showToast('请选择分类');
      return;
    }

    Storage.saveAccount(Storage.today(), this.currentType, amount, this.currentCategory, note);

    // 清空表单
    document.getElementById('account-amount').value = '';
    document.getElementById('account-note').value = '';
    this.currentCategory = null;
    this.renderCategories();

    this.renderSummary();
    this.renderLists();
    showToast('记录已添加');
  },

  renderSummary() {
    const monthStr = Storage.monthStr(new Date());
    const records = Storage.getAccountByMonth(monthStr);

    let income = 0, expense = 0;
    records.forEach(r => {
      if (r.type === 'income') income += r.amount;
      else expense += r.amount;
    });

    document.getElementById('month-income').textContent = `¥${income.toFixed(2)}`;
    document.getElementById('month-expense').textContent = `¥${expense.toFixed(2)}`;

    // 同时渲染饼图
    this.renderPieChart(records);
  },

  renderLists() {
    // 今日明细
    const todayRecords = Storage.getAccountByDate(Storage.today());
    const todayList = document.getElementById('account-today-list');
    if (todayRecords.length === 0) {
      todayList.innerHTML = '<p class="reading-empty">今日暂无记录</p>';
    } else {
      todayList.innerHTML = todayRecords.slice().reverse().map(r => this.renderItem(r)).join('');
    }

    // 本月明细（排除今日，只显示近10条）
    const monthStr = Storage.monthStr(new Date());
    const monthRecords = Storage.getAccountByMonth(monthStr)
      .filter(r => r.date !== Storage.today())
      .slice(-10)
      .reverse();
    const monthList = document.getElementById('account-month-list');
    if (monthRecords.length === 0) {
      monthList.innerHTML = '<p class="reading-empty">本月暂无其他记录</p>';
    } else {
      monthList.innerHTML = monthRecords.map(r => this.renderItem(r)).join('');
    }
  },

  renderItem(r) {
    const cats = this.categories[r.type];
    const cat = cats.find(c => c.name === r.category) || cats[cats.length - 1];
    const dateParts = r.date.split('-');
    const dateLabel = `${parseInt(dateParts[1])}/${parseInt(dateParts[2])}`;

    return `
      <div class="acc-item">
        <div class="acc-cat-icon">${cat.icon}</div>
        <div class="acc-info">
          <span class="acc-cat-label">${r.category}</span>
          ${r.note ? `<span class="acc-note">${this.escapeHtml(r.note)}</span>` : ''}
          <span class="acc-time">${dateLabel} ${r.time || ''}</span>
        </div>
        <span class="acc-amount ${r.type}">${r.type === 'income' ? '+' : '-'}¥${r.amount.toFixed(2)}</span>
      </div>
    `;
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ===== 月度分类饼图 =====
  renderPieChart(records) {
    const canvas = document.getElementById('pie-chart');
    const legendEl = document.getElementById('pie-legend');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) / 2 - 20;

    ctx.clearRect(0, 0, W, H);

    // 按分类汇总支出
    const expenseRecords = records.filter(r => r.type === 'expense');
    if (expenseRecords.length === 0) {
      ctx.fillStyle = '#B5A99A';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('暂无支出数据', W / 2, H / 2);
      legendEl.innerHTML = '';
      return;
    }

    const catTotals = {};
    expenseRecords.forEach(r => {
      catTotals[r.category] = (catTotals[r.category] || 0) + r.amount;
    });

    const totalExpense = Object.values(catTotals).reduce((a, b) => a + b, 0);
    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

    // 饼图颜色（森系配色）
    const colors = ['#8BA888', '#E8A87C', '#C9B79C', '#85B79D', '#D4A574',
                     '#B5C9A8', '#C97B5C', '#A3B5A0'];

    // 画饼图
    let startAngle = -Math.PI / 2;
    sortedCats.forEach((entry, i) => {
      const [cat, amount] = entry;
      const angle = (amount / totalExpense) * Math.PI * 2;
      const endAngle = startAngle + angle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#F7F3ED';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // 中心白色圆（环形效果）
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // 中心文字
    ctx.fillStyle = '#4A4036';
    ctx.font = 'bold 16px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('¥' + totalExpense.toFixed(0), cx, cy - 2);
    ctx.fillStyle = '#B5A99A';
    ctx.font = '11px sans-serif';
    ctx.fillText('总支出', cx, cy + 14);

    // 图例
    const allCats = this.categories.expense;
    legendEl.innerHTML = sortedCats.map((entry, i) => {
      const [cat, amount] = entry;
      const catDef = allCats.find(c => c.name === cat) || { icon: '💡', name: cat };
      const pct = ((amount / totalExpense) * 100).toFixed(1);
      return `
        <div class="pie-legend-item">
          <span class="pie-legend-dot" style="background:${colors[i % colors.length]}"></span>
          <span>${catDef.icon} ${cat}</span>
          <span class="pie-legend-amount">¥${amount.toFixed(0)} (${pct}%)</span>
        </div>
      `;
    }).join('');
  },

  getHomeStatus() {
    const todayRecords = Storage.getAccountByDate(Storage.today());
    if (todayRecords.length === 0) {
      return { text: '今日尚未记账', done: false };
    }
    let expense = 0;
    todayRecords.forEach(r => {
      if (r.type === 'expense') expense += r.amount;
    });
    return { text: `今日支出 ¥${expense.toFixed(2)}`, done: true };
  }
};

// 全局函数
function switchAccType(type) { AccountModule.switchType(type); }
function selectCategory(name) { AccountModule.selectCategory(name); }
function saveAccount() { AccountModule.save(); }
