// 运动模块
const ExerciseModule = {
  // 运动选项定义
  cardioOptions: [
    "爬楼半小时",
    "爬坡半小时",
    "爬坡一小时",
    "跳操半小时",
    "跳操一小时"
  ],

  strengthOptions: [
    "上肢力量训练",
    "下肢力量训练",
    "欧阳春晓沙漏腰",
    "死虫式",
    "平板支撑",
    "呼吸训练",
    "瑜伽球训练",
    "刘板筋手臂训练",
    "欧阳春晓肩背训练"
  ],

  // 当前日历月份
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),

  // 初始化
  init() {
    this.renderCheckGrid();
    this.renderCalendar();
    this.updateDateLabel();
  },

  updateDateLabel() {
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const label = `${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
    document.getElementById('exercise-date-label').textContent = label;
  },

  // 渲染打卡网格
  renderCheckGrid() {
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);

    // 有氧
    const cardioGrid = document.getElementById('cardio-grid');
    cardioGrid.innerHTML = '';
    this.cardioOptions.forEach(opt => {
      const checked = data.cardio.includes(opt);
      const div = document.createElement('div');
      div.className = 'check-item' + (checked ? ' checked' : '');
      div.innerHTML = `<span class="check-circle"></span><span class="check-name">${opt}</span>`;
      div.onclick = () => this.toggleCheck('cardio', opt);
      cardioGrid.appendChild(div);
    });

    // 塑形
    const strengthGrid = document.getElementById('strength-grid');
    strengthGrid.innerHTML = '';
    this.strengthOptions.forEach(opt => {
      const checked = data.strength.includes(opt);
      const div = document.createElement('div');
      div.className = 'check-item' + (checked ? ' checked' : '');
      div.innerHTML = `<span class="check-circle"></span><span class="check-name">${opt}</span>`;
      div.onclick = () => this.toggleCheck('strength', opt);
      strengthGrid.appendChild(div);
    });
  },

  // 切换打卡状态
  toggleCheck(type, item) {
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);
    const arr = data[type] || [];
    const isChecked = arr.includes(item);

    Storage.saveExerciseCheck(todayStr, type, item, !isChecked);
    this.renderCheckGrid();
    this.renderCalendar();

    if (!isChecked) {
      showToast(`已打卡: ${item}`);
    }
  },

  // 渲染日历
  renderCalendar() {
    const container = document.getElementById('exercise-calendar');
    const monthLabel = document.getElementById('cal-month-label');
    const titleEl = document.getElementById('calendar-title');

    const year = this.calYear;
    const month = this.calMonth;
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                        '七月', '八月', '九月', '十月', '十一月', '十二月'];

    monthLabel.textContent = `${year}年 ${monthNames[month]}`;
    titleEl.textContent = `${monthNames[month]}打卡日历`;

    // 生成日历
    const firstDay = new Date(year, month, 1).getDay(); // 0=周日
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = Storage.formatDate(today);

    let html = '<div class="cal-header">';
    ['日', '一', '二', '三', '四', '五', '六'].forEach(d => {
      html += `<span>${d}</span>`;
    });
    html += '</div>';

    // 空格
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day empty"></div>';
    }

    // 日期
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const exData = Storage.getExerciseByDate(dateStr);
      const hasCardio = exData.cardio.length > 0;
      const hasStrength = exData.strength.length > 0;

      let classes = 'cal-day';
      if (dateStr === todayStr) classes += ' today';
      if (hasCardio && hasStrength) classes += ' has-both';
      else if (hasCardio) classes += ' has-cardio';
      else if (hasStrength) classes += ' has-strength';

      html += `<div class="${classes}" onclick="showDayDetail('${dateStr}', ${d})">${d}</div>`;
    }

    container.innerHTML = html;
  },

  // 切换月份
  changeMonth(delta) {
    this.calMonth += delta;
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear--;
    } else if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear++;
    }
    this.renderCalendar();
  },

  // 获取首页状态
  getHomeStatus() {
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);
    const total = data.cardio.length + data.strength.length;
    if (total === 0) return { text: '今日尚未打卡', done: false };
    const parts = [];
    if (data.cardio.length > 0) parts.push(`有氧${data.cardio.length}项`);
    if (data.strength.length > 0) parts.push(`塑形${data.strength.length}项`);
    return { text: parts.join(' · '), done: true };
  },

  // 获取连续打卡天数
  getStreak() {
    let streak = 0;
    let date = new Date();
    while (true) {
      const dateStr = Storage.formatDate(date);
      const data = Storage.getExerciseByDate(dateStr);
      if (data.cardio.length > 0 || data.strength.length > 0) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }
};

// 全局函数
function changeMonth(delta) {
  ExerciseModule.changeMonth(delta);
}

// 查看某天打卡详情
function showDayDetail(dateStr, dayNum) {
  const data = Storage.getExerciseByDate(dateStr);
  const parts = dateStr.split('-');
  const title = `${parseInt(parts[1])}月${dayNum}日打卡详情`;

  document.getElementById('day-detail-title').textContent = title;

  let body = '';

  if (data.cardio.length === 0 && data.strength.length === 0) {
    body = '<div class="day-detail-empty">这天没有运动记录</div>';
  } else {
    if (data.cardio.length > 0) {
      body += '<div class="day-detail-section"><h3>🏃 有氧运动</h3><div class="day-detail-items">';
      data.cardio.forEach(item => {
        body += `<span class="day-detail-tag cardio">${item}</span>`;
      });
      body += '</div></div>';
    }

    if (data.strength.length > 0) {
      body += '<div class="day-detail-section"><h3>💪 塑形训练</h3><div class="day-detail-items">';
      data.strength.forEach(item => {
        body += `<span class="day-detail-tag strength">${item}</span>`;
      });
      body += '</div></div>';
    }

    const total = data.cardio.length + data.strength.length;
    body += `<p style="text-align:center;color:var(--sage-dark);font-size:0.85rem;margin-top:12px;">共完成 ${total} 项运动</p>`;
  }

  document.getElementById('day-detail-body').innerHTML = body;
  document.getElementById('day-detail-modal').classList.add('show');
}
