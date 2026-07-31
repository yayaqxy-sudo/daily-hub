// 主应用入口
const App = {
  currentPage: 'home',

  init() {
    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('SW registration failed:', err);
      });
    }

    // 初始化所有模块
    ExerciseModule.init();
    EnglishModule.init();
    DietModule.init();
    ReadingModule.init();
    AccountModule.init();
    QuoteModule.init();

    // 渲染首页
    this.renderHome();

    // 回车键提交拼写测试
    document.getElementById('test-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitTest();
      }
    });

    // 体重输入回车
    document.getElementById('weight-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveWeight();
      }
    });
  },

  // 渲染首页数据
  renderHome() {
    // 日期和问候
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const months = ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'];
    document.getElementById('home-date').textContent =
      `${months[today.getMonth()]} ${today.getDate()}`;

    const hour = today.getHours();
    let greeting;
    if (hour < 6) greeting = '夜深了，记得休息';
    else if (hour < 9) greeting = '早安，新的一天开始了';
    else if (hour < 12) greeting = '上午好，保持专注';
    else if (hour < 14) greeting = '午安，记得吃饭';
    else if (hour < 18) greeting = '下午好，继续加油';
    else if (hour < 22) greeting = '晚上好，今天辛苦了';
    else greeting = '该休息了，晚安';
    document.getElementById('home-greeting').textContent = greeting;

    // 各模块状态
    const exStatus = ExerciseModule.getHomeStatus();
    document.getElementById('home-exercise-status').textContent = exStatus.text;

    const engStatus = EnglishModule.getHomeStatus();
    document.getElementById('home-english-status').textContent = engStatus.text;

    const dietStatus = DietModule.getHomeStatus();
    document.getElementById('home-diet-status').textContent = dietStatus.text;

    const readStatus = ReadingModule.getHomeStatus();
    document.getElementById('home-reading-status').textContent = readStatus.text;

    const accStatus = AccountModule.getHomeStatus();
    document.getElementById('home-account-status').textContent = accStatus.text;

    // 连续打卡
    document.getElementById('streak-exercise').textContent = ExerciseModule.getStreak();
    document.getElementById('streak-english').textContent = EnglishModule.getStreak();
    document.getElementById('streak-total').textContent = this.getTotalStreak();
  },

  getTotalStreak() {
    let streak = 0;
    let date = new Date();
    while (true) {
      const dateStr = Storage.formatDate(date);
      const exData = Storage.getExerciseByDate(dateStr);
      const engData = Storage.getEnglishData();
      const speakDates = engData.speakDates || [];
      const meals = Storage.getMealsByDate(dateStr);
      const reading = Storage.getReadingByDate(dateStr);
      const accounts = Storage.getAccountByDate(dateStr);

      const hasActivity =
        exData.cardio.length > 0 || exData.strength.length > 0 ||
        speakDates.includes(dateStr) ||
        meals.breakfast || meals.lunch || meals.dinner ||
        reading || accounts.length > 0;

      if (hasActivity) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  // 页面跳转
  goTo(page) {
    // 处理"更多"按钮
    if (page === 'more') {
      document.getElementById('more-panel').classList.add('show');
      return;
    }

    // 切换页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
      target.classList.add('active');
      this.currentPage = page;
    }

    // 切换导航高亮
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // 滚动到顶部
    window.scrollTo(0, 0);

    // 重新渲染对应页面数据
    if (page === 'home') this.renderHome();
    else if (page === 'exercise') ExerciseModule.init();
    else if (page === 'english') EnglishModule.init();
    else if (page === 'diet') DietModule.init();
    else if (page === 'reading') ReadingModule.init();
    else if (page === 'account') AccountModule.init();
  },

  closeMore() {
    document.getElementById('more-panel').classList.remove('show');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('show');
  },

  closeImageViewer() {
    document.getElementById('image-viewer').classList.remove('show');
  },

  exportData() {
    const data = Storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-hub-backup-${Storage.today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('数据已导出');
  },

  importData() {
    const input = document.getElementById('import-file-input');
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          // 验证数据格式
          if (!data.exercise || !data.english) {
            showToast('文件格式不正确');
            return;
          }

          if (!confirm('导入数据将覆盖当前所有数据，确定继续吗？')) {
            return;
          }

          // 写入各模块数据
          if (data.exercise) localStorage.setItem('exercise_data', JSON.stringify(data.exercise));
          if (data.english) localStorage.setItem('english_data', JSON.stringify(data.english));
          if (data.diet) localStorage.setItem('diet_data', JSON.stringify(data.diet));
          if (data.reading) localStorage.setItem('reading_data', JSON.stringify(data.reading));
          if (data.account) localStorage.setItem('account_data', JSON.stringify(data.account));

          showToast('数据导入成功！正在刷新...');

          // 关闭更多面板
          this.closeMore();

          // 延迟刷新页面
          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } catch (err) {
          showToast('文件解析失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
      input.value = ''; // 重置以便重复选择
    };
    input.click();
  }
};

// ===== 全局工具函数 =====
function goTo(page) { App.goTo(page); }
function closeMore() { App.closeMore(); }
function closeModal(id) { App.closeModal(id); }
function closeImageViewer() { App.closeImageViewer(); }
function exportData() { App.exportData(); }
function importData() { App.importData(); }

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 图片点击查看大图
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('meal-photo')) {
    const viewer = document.getElementById('image-viewer');
    document.getElementById('image-viewer-img').src = e.target.src;
    viewer.classList.add('show');
  }
});

// 启动
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
