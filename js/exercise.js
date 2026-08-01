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
  // 每个区域包含训练项目和对应的身体标注位置
  bodyRegions: [
    {
      id: 'face',
      label: '面部',
      anatomy: '咬肌 / 面部肌肉',
      view: 'front',
      items: ['瘦脸操'],
      // SVG中标注区域的中心坐标 (百分比)
      x: 50, y: 6
    },
    {
      id: 'neck',
      label: '颈椎 / 脖子前倾',
      anatomy: '颈椎 / 胸锁乳突肌 / 斜角肌',
      view: 'front',
      items: ['肩颈训练', '改善脖子前倾'],
      x: 50, y: 14
    },
    {
      id: 'upperback-neck',
      label: '富贵包 / 肩颈',
      anatomy: '颈椎C7-T1 / 斜方肌上束',
      view: 'back',
      items: ['改善富贵包'],
      x: 50, y: 15
    },
    {
      id: 'thoracic',
      label: '胸椎灵活度',
      anatomy: '胸椎T1-T12 / 肋间肌',
      view: 'back',
      items: ['胸椎灵活度训练'],
      x: 50, y: 26
    },
    {
      id: 'shoulder',
      label: '肩部',
      anatomy: '三角肌 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 35, y: 22
    },
    {
      id: 'shoulder-r',
      label: '肩部',
      anatomy: '三角肌 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 65, y: 22,
      mirror: 'shoulder'
    },
    {
      id: 'traps',
      label: '斜方肌 / 背部',
      anatomy: '斜方肌中下束 / 菱形肌',
      view: 'back',
      items: ['背部力量训练'],
      x: 50, y: 22
    },
    {
      id: 'chest',
      label: '胸部',
      anatomy: '胸大肌 / 胸小肌',
      view: 'front',
      items: ['胸部力量训练'],
      x: 50, y: 27
    },
    {
      id: 'arms',
      label: '大臂 / 小臂',
      anatomy: '肱二头肌 / 肱三头肌 / 前臂肌群',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 28, y: 33
    },
    {
      id: 'arms-r',
      label: '大臂 / 小臂',
      anatomy: '肱二头肌 / 肱三头肌 / 前臂肌群',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 72, y: 33,
      mirror: 'arms'
    },
    {
      id: 'waist',
      label: '沙漏腰',
      anatomy: '腹外斜肌 / 腹内斜肌',
      view: 'front',
      items: ['沙漏腰训练'],
      x: 50, y: 42
    },
    {
      id: 'core',
      label: '核心 / 腹部',
      anatomy: '腹直肌 / 腹横肌',
      view: 'front',
      items: ['死虫式训练', '腹横肌呼吸训练', '核心力量训练'],
      x: 50, y: 47
    },
    {
      id: 'lowerback',
      label: '腰腹放松',
      anatomy: '竖脊肌 / 多裂肌 / 腰方肌',
      view: 'back',
      items: ['瑜伽球放松腰腹'],
      x: 50, y: 42
    },
    {
      id: 'hip',
      label: '髋关节',
      anatomy: '髂腰肌 / 臀中肌 / 髋关节囊',
      view: 'front',
      items: ['髋关节训练'],
      x: 50, y: 54
    },
    {
      id: 'glutes',
      label: '臀腿',
      anatomy: '臀大肌 / 股四头肌 / 腘绳肌',
      view: 'back',
      items: ['臀腿力量训练'],
      x: 50, y: 58
    },
    {
      id: 'feet',
      label: '足弓',
      anatomy: '足底筋膜 / 胫骨后肌',
      view: 'back',
      items: ['欧阳春晓足弓训练'],
      x: 50, y: 92
    }
  ],

  // 当前视图: 'front' 或 'back'
  bodyView: 'front',
  // 当前选中区域
  selectedRegion: null,
  // 当前日历月份
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),

  // 初始化
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

  // 渲染有氧打卡网格
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

  // 渲染人体图
  renderBodyMap() {
    const container = document.getElementById('body-map-container');
    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);
    const checkedItems = data.strength;

    // 获取当前视图的区域 (排除mirror的)
    const visibleRegions = this.bodyRegions.filter(r => r.view === this.bodyView && !r.mirror);

    // 构建SVG
    let svg = '';
    svg += `<div class="body-svg-wrap ${this.bodyView}">`;

    // SVG人体图
    svg += `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" class="body-svg">`;

    // 人体轮廓 (正面)
    if (this.bodyView === 'front') {
      svg += this.getFrontBodySVG();
    } else {
      svg += this.getBackBodySVG();
    }

    // 标注点
    this.bodyRegions.forEach(region => {
      if (region.view !== this.bodyView) return;

      const hasChecked = region.items.some(item => checkedItems.includes(item));
      const allChecked = region.items.every(item => checkedItems.includes(item));
      const isSelected = this.selectedRegion === region.id;

      // 标注圆点
      let dotClass = 'body-dot';
      if (allChecked) dotClass += ' all-done';
      else if (hasChecked) dotClass += ' some-done';
      if (isSelected) dotClass += ' selected';

      svg += `<g class="body-region-group" onclick="selectBodyRegion('${region.id}')">`;
      // 点击热区
      svg += `<circle cx="${region.x}" cy="${region.y}" r="6" fill="transparent" class="body-hotspot"/>`;
      // 标注点
      svg += `<circle cx="${region.x}" cy="${region.y}" r="3" class="${dotClass}"/>`;
      // 标注线
      const labelY = region.y < 50 ? region.y - 8 : region.y + 8;
      const labelSide = region.x < 50 ? 'left' : 'right';
      svg += `<line x1="${region.x}" y1="${region.y}" x2="${labelSide === 'left' ? region.x - 10 : region.x + 10}" y2="${labelY}" class="body-label-line"/>`;
      // 标注文字
      const textX = labelSide === 'left' ? region.x - 11 : region.x + 11;
      const textAnchor = labelSide === 'left' ? 'end' : 'start';
      svg += `<text x="${textX}" y="${labelY + 1}" class="body-label-text" text-anchor="${textAnchor}">${region.label}</text>`;
      svg += `</g>`;
    });

    svg += `</svg>`;

    // 统计
    const allItems = visibleRegions.flatMap(r => r.items);
    const doneCount = allItems.filter(item => checkedItems.includes(item)).length;
    svg += `<div class="body-stats"><span>${doneCount} / ${allItems.length} 项已完成</span></div>`;

    svg += `</div>`;
    container.innerHTML = svg;

    // 渲染选中区域的训练面板
    this.renderRegionPanel();
  },

  // 正面人体SVG
  getFrontBodySVG() {
    return `
      <!-- 头部 -->
      <ellipse cx="50" cy="8" rx="5" ry="6" class="body-outline"/>
      <!-- 脖子 -->
      <path d="M 47 13 L 47 16 L 53 16 L 53 13 Z" class="body-outline"/>
      <!-- 肩膀+躯干 -->
      <path d="M 35 17 Q 42 16 50 16 Q 58 16 65 17 L 67 22 L 64 25 L 62 30 L 58 34 L 56 40 Q 54 45 52 48 L 48 48 Q 46 45 44 40 L 42 34 L 38 30 L 36 25 L 33 22 Z" class="body-outline"/>
      <!-- 左臂 -->
      <path d="M 33 22 L 28 24 L 25 30 L 23 38 L 22 46 L 21 52 L 24 53 L 26 48 L 28 42 L 30 35 L 32 30 L 34 26 Z" class="body-outline"/>
      <!-- 右臂 -->
      <path d="M 67 22 L 72 24 L 75 30 L 77 38 L 78 46 L 79 52 L 76 53 L 74 48 L 72 42 L 70 35 L 68 30 L 66 26 Z" class="body-outline"/>
      <!-- 腰部 -->
      <path d="M 44 40 Q 42 45 42 50 L 43 55 L 48 56 L 52 56 L 57 55 L 58 50 Q 58 45 56 40 Z" class="body-outline"/>
      <!-- 髋部 -->
      <path d="M 43 55 L 42 60 L 41 65 L 44 68 L 50 68 L 56 68 L 59 65 L 58 60 L 57 55 Z" class="body-outline"/>
      <!-- 左腿 -->
      <path d="M 42 68 L 40 75 L 39 82 L 40 90 L 43 95 L 45 95 L 46 90 L 47 82 L 48 75 L 48 68 Z" class="body-outline"/>
      <!-- 右腿 -->
      <path d="M 58 68 L 60 75 L 61 82 L 60 90 L 57 95 L 55 95 L 54 90 L 53 82 L 52 75 L 52 68 Z" class="body-outline"/>
      <!-- 解剖标注线 -->
      <line x1="50" y1="13" x2="50" y2="16" class="anatomy-line" stroke-dasharray="0.5,0.5"/>
      <line x1="50" y1="16" x2="50" y2="40" class="anatomy-line" stroke-dasharray="0.5,0.5"/>
      <line x1="50" y1="40" x2="50" y2="55" class="anatomy-line" stroke-dasharray="0.5,0.5"/>
    `;
  },

  // 背面人体SVG
  getBackBodySVG() {
    return `
      <!-- 头部 -->
      <ellipse cx="50" cy="8" rx="5" ry="6" class="body-outline"/>
      <!-- 脖子(背面-颈椎) -->
      <path d="M 47 13 L 47 17 L 53 17 L 53 13 Z" class="body-outline"/>
      <!-- 肩膀+背部 -->
      <path d="M 33 17 Q 42 16 50 16 Q 58 16 67 17 L 69 22 L 66 26 L 64 30 L 60 35 L 57 42 Q 55 47 53 50 L 47 50 Q 45 47 43 42 L 40 35 L 36 30 L 34 26 L 31 22 Z" class="body-outline"/>
      <!-- 左臂(背面) -->
      <path d="M 31 22 L 27 25 L 24 31 L 22 39 L 21 47 L 20 53 L 23 54 L 25 49 L 27 43 L 29 36 L 31 31 L 33 27 Z" class="body-outline"/>
      <!-- 右臂(背面) -->
      <path d="M 69 22 L 73 25 L 76 31 L 78 39 L 79 47 L 80 53 L 77 54 L 75 49 L 73 43 L 71 36 L 69 31 L 67 27 Z" class="body-outline"/>
      <!-- 腰部(背面) -->
      <path d="M 43 42 Q 41 47 41 52 L 42 57 L 47 58 L 53 58 L 58 57 L 59 52 Q 59 47 57 42 Z" class="body-outline"/>
      <!-- 髋部/臀部(背面) -->
      <path d="M 42 57 L 40 63 L 39 70 L 42 74 L 50 75 L 58 74 L 61 70 L 60 63 L 58 57 Z" class="body-outline"/>
      <!-- 左腿(背面) -->
      <path d="M 42 75 L 41 82 L 40 88 L 41 95 L 43 97 L 45 97 L 46 92 L 47 84 L 48 78 L 48 75 Z" class="body-outline"/>
      <!-- 右腿(背面) -->
      <path d="M 58 75 L 59 82 L 60 88 L 59 95 L 57 97 L 55 97 L 54 92 L 53 84 L 52 78 L 52 75 Z" class="body-outline"/>
      <!-- 脊柱线 -->
      <line x1="50" y1="17" x2="50" y2="57" class="anatomy-line" stroke-dasharray="0.8,0.4"/>
    `;
  },

  // 渲染选中区域的训练面板
  renderRegionPanel() {
    const panel = document.getElementById('body-region-panel');
    if (!this.selectedRegion) {
      panel.innerHTML = '<p class="body-region-hint">👆 点击身体上的高亮区域选择训练</p>';
      return;
    }

    const region = this.bodyRegions.find(r => r.id === this.selectedRegion);
    if (!region) return;

    const todayStr = Storage.today();
    const data = Storage.getExerciseByDate(todayStr);

    let html = `<div class="region-panel-header">`;
    html += `<h3 class="region-title">${region.label}</h3>`;
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

  // 选择身体区域
  selectBodyRegion(regionId) {
    if (this.selectedRegion === regionId) {
      this.selectedRegion = null;
    } else {
      this.selectedRegion = regionId;
    }
    this.renderBodyMap();
  },

  // 切换正/背面视图
  toggleBodyView() {
    this.bodyView = this.bodyView === 'front' ? 'back' : 'front';
    this.selectedRegion = null;
    document.getElementById('body-view-toggle').textContent = this.bodyView === 'front' ? '查看背面' : '查看正面';
    this.renderBodyMap();
  },

  // 切换塑形打卡
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

  // 有氧打卡切换
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

// 全局函数
function changeMonth(delta) {
  ExerciseModule.changeMonth(delta);
}

function toggleBodyView() {
  ExerciseModule.toggleBodyView();
}

function selectBodyRegion(regionId) {
  ExerciseModule.selectBodyRegion(regionId);
}

function toggleStrengthItem(item) {
  ExerciseModule.toggleStrength(item);
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
