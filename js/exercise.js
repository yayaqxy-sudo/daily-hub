// 运动模块
const ExerciseModule = {
  // 有氧选项
  cardioOptions: [
    "爬楼半小时",
    "爬坡半小时",
    "爬坡一小时",
    "跳操半小时",
    "跳操一小时"
  ],

  // 塑形训练 - 按身体区域分组
  // 坐标(x%, y%)匹配 viewBox 100x125（图片4:5比例），引线终点(lx%, ly%)
  bodyRegions: [
    // ===== 正面区域 =====
    {
      id: 'face',
      label: '面部',
      anatomy: '咬肌 / 面部表情肌',
      view: 'front',
      items: ['瘦脸操'],
      x: 50, y: 7, lx: 86, ly: 7
    },
    {
      id: 'neck',
      label: '颈椎',
      anatomy: '颈椎 / 胸锁乳突肌',
      view: 'front',
      items: ['肩颈训练', '改善脖子前倾'],
      x: 50, y: 16, lx: 14, ly: 16
    },
    {
      id: 'shoulder-l',
      label: '肩部',
      anatomy: '三角肌 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 40, y: 23, lx: 13, ly: 23
    },
    {
      id: 'shoulder-r',
      label: '肩部',
      anatomy: '三角肌 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 60, y: 23, lx: 87, ly: 23
    },
    {
      id: 'chest',
      label: '胸部',
      anatomy: '胸大肌 / 胸小肌',
      view: 'front',
      items: ['胸部力量训练'],
      x: 50, y: 30, lx: 87, ly: 30
    },
    {
      id: 'arms-l',
      label: '手臂',
      anatomy: '肱二头肌 / 肱三头肌',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 32, y: 42, lx: 13, ly: 42
    },
    {
      id: 'arms-r',
      label: '手臂',
      anatomy: '肱二头肌 / 肱三头肌',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 68, y: 42, lx: 87, ly: 42
    },
    {
      id: 'waist',
      label: '沙漏腰',
      anatomy: '腹外斜肌 / 腹内斜肌',
      view: 'front',
      items: ['沙漏腰训练'],
      x: 42, y: 52, lx: 13, ly: 52
    },
    {
      id: 'core',
      label: '核心',
      anatomy: '腹直肌 / 腹横肌',
      view: 'front',
      items: ['死虫式训练', '腹横肌呼吸训练', '核心力量训练'],
      x: 58, y: 52, lx: 87, ly: 52
    },
    {
      id: 'hip',
      label: '髋关节',
      anatomy: '髂腰肌 / 臀中肌',
      view: 'front',
      items: ['髋关节训练'],
      x: 50, y: 60, lx: 87, ly: 60
    },
    {
      id: 'thigh',
      label: '大腿',
      anatomy: '股四头肌 / 内收肌群',
      view: 'front',
      items: ['臀腿力量训练'],
      x: 38, y: 75, lx: 13, ly: 75
    },
    {
      id: 'shin',
      label: '小腿',
      anatomy: '腓肠肌 / 胫骨前肌',
      view: 'front',
      items: ['欧阳春晓足弓训练'],
      x: 42, y: 100, lx: 13, ly: 100
    },

    // ===== 背面区域 =====
    {
      id: 'neck-back',
      label: '颈椎',
      anatomy: '颈椎C7 / 富贵包',
      view: 'back',
      items: ['改善富贵包'],
      x: 50, y: 16, lx: 14, ly: 16
    },
    {
      id: 'thoracic',
      label: '胸椎',
      anatomy: '胸椎T1-T12 / 肋间肌',
      view: 'back',
      items: ['胸椎灵活度训练'],
      x: 50, y: 26, lx: 87, ly: 26
    },
    {
      id: 'traps',
      label: '斜方肌',
      anatomy: '斜方肌 / 菱形肌 / 背阔肌',
      view: 'back',
      items: ['背部力量训练'],
      x: 50, y: 32, lx: 13, ly: 32
    },
    {
      id: 'lowerback',
      label: '腰腹',
      anatomy: '竖脊肌 / 多裂肌',
      view: 'back',
      items: ['瑜伽球放松腰腹'],
      x: 50, y: 50, lx: 87, ly: 50
    },
    {
      id: 'glutes',
      label: '臀部',
      anatomy: '臀大肌 / 臀中肌',
      view: 'back',
      items: ['臀腿力量训练'],
      x: 50, y: 62, lx: 13, ly: 62
    },
    {
      id: 'hamstring',
      label: '大腿后侧',
      anatomy: '腘绳肌 / 股二头肌',
      view: 'back',
      items: ['髋关节训练'],
      x: 42, y: 78, lx: 87, ly: 78
    },
    {
      id: 'calf',
      label: '小腿',
      anatomy: '腓肠肌 / 比目鱼肌',
      view: 'back',
      items: ['欧阳春晓足弓训练'],
      x: 58, y: 100, lx: 13, ly: 100
    }
  ],

  bodyView: 'front',
  selectedRegion: null,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),

  init() {
    this.renderCheckGrid();
    this.renderBodyMap();
    this.renderCalendar();
    this.updateDateLabel();
  },

  updateDateLabel() {
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const label = `${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
    document.getElementById('exercise-date-label').textContent = label;
  },

  renderCheckGrid() {
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);

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
  },

  // 渲染人体图 - 基于真实图片 + 标注
  renderBodyMap() {
    const container = document.getElementById('body-map-container');
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);
    const checkedItems = data.strength;

    // 当前视图的可见区域
    const visibleRegions = this.bodyRegions.filter(r => r.view === this.bodyView);

    // 统计
    const allItems = visibleRegions.flatMap(r => r.items);
    const doneCount = allItems.filter(item => checkedItems.includes(item)).length;

    // 图片路径
    const imgSrc = this.bodyView === 'front'
      ? 'img/body-front.png'
      : 'img/body-back.png';

    let html = `<div class="body-image-wrap">`;
    html += `<img src="${imgSrc}" class="body-image" alt="人体肌肉解剖图" />`;

    // SVG 层 - 绘制标注引线（viewBox 匹配图片 4:5 比例）
    html += `<svg class="body-labels-svg" viewBox="0 0 100 125" preserveAspectRatio="xMidYMid meet">`;

    this.bodyRegions.forEach(region => {
      if (region.view !== this.bodyView) return;

      const hasChecked = region.items.some(item => checkedItems.includes(item));
      const allChecked = region.items.every(item => checkedItems.includes(item));
      const isSelected = this.selectedRegion === region.id;

      let dotClass = 'body-dot';
      if (allChecked) dotClass += ' all-done';
      else if (hasChecked) dotClass += ' some-done';
      if (isSelected) dotClass += ' selected';

      // 绘制引线（从热点到标签位置）
      const lineColor = isSelected ? '#d97c5a' :
                        allChecked ? '#4a6b3e' :
                        hasChecked ? '#7a9266' : '#9ba89b';

      html += `<line x1="${region.x}" y1="${region.y}" x2="${region.lx}" y2="${region.ly}"
                stroke="${lineColor}" stroke-width="0.25" stroke-dasharray="0.5,0.5" opacity="0.7"/>`;

      // 热点圆点
      const r = (region.r || 2.2);
      html += `<circle cx="${region.x}" cy="${region.y}" r="${r}"
                class="${dotClass}" data-region="${region.id}"
                onclick="selectBodyRegion('${region.id}')"/>`;
    });

    html += `</svg>`;

    // HTML 标签层
    this.bodyRegions.forEach(region => {
      if (region.view !== this.bodyView) return;

      const hasChecked = region.items.some(item => checkedItems.includes(item));
      const allChecked = region.items.every(item => checkedItems.includes(item));
      const isSelected = this.selectedRegion === region.id;

      let labelClass = 'body-label';
      if (allChecked) labelClass += ' all-done';
      else if (hasChecked) labelClass += ' some-done';
      if (isSelected) labelClass += ' selected';

      const align = region.lx < 50 ? 'left' : 'right';

      html += `<div class="${labelClass} ${align}"
                style="left:${region.lx}%;top:${region.ly}%;"
                onclick="selectBodyRegion('${region.id}')">
                <span class="label-dot"></span>
                <span class="label-text">${region.label}</span>
              </div>`;
    });

    html += `</div>`;
    html += `<div class="body-stats"><span>已完成 ${doneCount} / ${allItems.length} 项</span></div>`;
    html += `<div class="body-hint">💡 点击身体部位或对应文字标签查看训练</div>`;

    container.innerHTML = html;
    this.renderRegionPanel();
  },

  renderRegionPanel() {
    const panel = document.getElementById('body-region-panel');
    if (!this.selectedRegion) {
      panel.innerHTML = '<p class="body-region-hint">👆 点击身体部位或文字标签选择训练</p>';
      return;
    }

    const region = this.bodyRegions.find(r => r.id === this.selectedRegion);
    if (!region) return;

    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);

    let html = `<div class="region-panel-header">`;
    html += `<h3 class="region-title">${region.label}训练</h3>`;
    html += `<p class="region-anatomy">${region.anatomy}</p>`;
    html += `</div>`;
    html += `<div class="region-check-list">`;

    region.items.forEach(item => {
      const checked = data.strength.includes(item);
      html += `<div class="check-item${checked ? ' checked' : ''}" onclick="toggleStrengthItem('${item.replace(/'/g, "\\'")}')">`;
      html += `<span class="check-circle"></span><span class="check-name">${item}</span>`;
      html += `</div>`;
    });

    html += `</div>`;
    panel.innerHTML = html;
  },

  selectBodyRegion(regionId) {
    if (this.selectedRegion === regionId) {
      this.selectedRegion = null;
    } else {
      this.selectedRegion = regionId;
    }
    this.renderBodyMap();
  },

  toggleBodyView() {
    this.bodyView = this.bodyView === 'front' ? 'back' : 'front';
    this.selectedRegion = null;
    document.getElementById('body-view-toggle').textContent = this.bodyView === 'front' ? '查看背面' : '查看正面';
    this.renderBodyMap();
  },

  toggleStrength(item) {
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);
    const isChecked = data.strength.includes(item);
    Storage.saveExerciseCheck(todayStr, 'strength', item, !isChecked);
    this.renderBodyMap();
    this.renderCalendar();
    if (!isChecked) {
      showToast(`已打卡: ${item}`);
    }
  },

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

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = Storage.formatDate(today);

    let html = '<div class="cal-header">';
    ['日', '一', '二', '三', '四', '五', '六'].forEach(d => {
      html += `<span>${d}</span>`;
    });
    html += '</div>';

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day empty"></div>';
    }

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

function changeMonth(delta) { ExerciseModule.changeMonth(delta); }
function toggleBodyView() { ExerciseModule.toggleBodyView(); }
function selectBodyRegion(regionId) { ExerciseModule.selectBodyRegion(regionId); }
function toggleStrengthItem(item) { ExerciseModule.toggleStrength(item); }

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