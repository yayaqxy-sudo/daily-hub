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
  // 每个区域映射到人体图上的一个热点 (x%, y%, 半径%)
  bodyRegions: [
    {
      id: 'face',
      label: '面部',
      anatomy: '咬肌 / 面部表情肌',
      view: 'front',
      items: ['瘦脸操'],
      x: 50, y: 9, r: 5
    },
    {
      id: 'neck',
      label: '颈椎 / 脖子',
      anatomy: '颈椎 / 胸锁乳突肌 / 斜角肌',
      view: 'front',
      items: ['肩颈训练', '改善脖子前倾'],
      x: 50, y: 14, r: 5
    },
    {
      id: 'shoulder-l',
      label: '左肩',
      anatomy: '三角肌前束 / 中束 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 36, y: 22, r: 5
    },
    {
      id: 'shoulder-r',
      label: '右肩',
      anatomy: '三角肌前束 / 中束 / 肩袖肌群',
      view: 'front',
      items: ['肩部力量训练'],
      x: 64, y: 22, r: 5
    },
    {
      id: 'chest',
      label: '胸部',
      anatomy: '胸大肌 / 胸小肌',
      view: 'front',
      items: ['胸部力量训练'],
      x: 50, y: 26, r: 6
    },
    {
      id: 'arms-l',
      label: '左臂',
      anatomy: '肱二头肌 / 肱三头肌 / 前臂肌群',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 28, y: 33, r: 5
    },
    {
      id: 'arms-r',
      label: '右臂',
      anatomy: '肱二头肌 / 肱三头肌 / 前臂肌群',
      view: 'front',
      items: ['大臂小臂训练'],
      x: 72, y: 33, r: 5
    },
    {
      id: 'waist',
      label: '沙漏腰',
      anatomy: '腹外斜肌 / 腹内斜肌',
      view: 'front',
      items: ['沙漏腰训练'],
      x: 50, y: 41, r: 6
    },
    {
      id: 'core',
      label: '核心 / 腹部',
      anatomy: '腹直肌 / 腹横肌',
      view: 'front',
      items: ['死虫式训练', '腹横肌呼吸训练', '核心力量训练'],
      x: 50, y: 47, r: 7
    },
    {
      id: 'hip',
      label: '髋关节',
      anatomy: '髂腰肌 / 臀中肌 / 髋关节囊',
      view: 'front',
      items: ['髋关节训练'],
      x: 50, y: 55, r: 6
    },
    {
      id: 'neck-back',
      label: '颈椎 / 富贵包',
      anatomy: '颈椎C7-T1 / 斜方肌上束 / 肩胛提肌',
      view: 'back',
      items: ['改善富贵包'],
      x: 50, y: 14, r: 5
    },
    {
      id: 'thoracic',
      label: '胸椎',
      anatomy: '胸椎T1-T12 / 肋间肌',
      view: 'back',
      items: ['胸椎灵活度训练'],
      x: 50, y: 22, r: 6
    },
    {
      id: 'traps',
      label: '斜方肌 / 背部',
      anatomy: '斜方肌中下束 / 菱形肌 / 背阔肌',
      view: 'back',
      items: ['背部力量训练'],
      x: 50, y: 28, r: 7
    },
    {
      id: 'lowerback',
      label: '腰腹放松',
      anatomy: '竖脊肌 / 多裂肌 / 腰方肌',
      view: 'back',
      items: ['瑜伽球放松腰腹'],
      x: 50, y: 42, r: 6
    },
    {
      id: 'glutes',
      label: '臀腿',
      anatomy: '臀大肌 / 股四头肌 / 腘绳肌',
      view: 'back',
      items: ['臀腿力量训练'],
      x: 50, y: 60, r: 8
    },
    {
      id: 'feet',
      label: '足弓',
      anatomy: '足底筋膜 / 胫骨后肌',
      view: 'back',
      items: ['欧阳春晓足弓训练'],
      x: 50, y: 93, r: 5
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

  // 渲染人体图 - 基于真实图片
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

    // 叠加热点
    this.bodyRegions.forEach(region => {
      if (region.view !== this.bodyView) return;

      const hasChecked = region.items.some(item => checkedItems.includes(item));
      const allChecked = region.items.every(item => checkedItems.includes(item));
      const isSelected = this.selectedRegion === region.id;

      let dotClass = 'body-dot';
      if (allChecked) dotClass += ' all-done';
      else if (hasChecked) dotClass += ' some-done';
      if (isSelected) dotClass += ' selected';

      const size = (region.r || 5) * 2;
      html += `<div class="${dotClass}"
                   style="left:${region.x}%;top:${region.y}%;width:${size}%;height:${size}%;transform:translate(-50%,-50%);"
                   onclick="selectBodyRegion('${region.id}')"
                   data-label="${region.label}">
                </div>`;
    });

    html += `</div>`;
    html += `<div class="body-stats"><span>已完成 ${doneCount} / ${allItems.length} 项</span></div>`;
    html += `<div class="body-hint">💡 点击身体上的彩色光点选择训练部位</div>`;

    container.innerHTML = html;
    this.renderRegionPanel();
  },

  renderRegionPanel() {
    const panel = document.getElementById('body-region-panel');
    if (!this.selectedRegion) {
      panel.innerHTML = '<p class="body-region-hint">👆 点击身体上的彩色光点选择训练</p>';
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
