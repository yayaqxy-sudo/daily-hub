// 阅读模块
const ReadingModule = {
  init() {
    this.renderForm();
    this.renderList();
  },

  renderForm() {
    const today = Storage.getReadingByDate(Storage.today());
    if (today) {
      document.getElementById('reading-book').value = today.book || '';
      document.getElementById('reading-pages').value = today.pages || '';
      document.getElementById('reading-note').value = today.note || '';
    }
  },

  save() {
    const book = document.getElementById('reading-book').value.trim();
    const pages = parseInt(document.getElementById('reading-pages').value) || 0;
    const note = document.getElementById('reading-note').value.trim();

    if (!book) {
      showToast('请输入书名');
      return;
    }

    Storage.saveReading(Storage.today(), book, pages, note);
    showToast('阅读记录已保存');
    this.renderList();
  },

  renderList() {
    const data = Storage.getReadingData();
    const container = document.getElementById('reading-list');

    if (data.length === 0) {
      container.innerHTML = '<p class="reading-empty">还没有阅读记录</p>';
      return;
    }

    // 倒序显示，最近在前
    const sorted = [...data].reverse();
    container.innerHTML = sorted.map(r => {
      const dateParts = r.date.split('-');
      const dateLabel = `${parseInt(dateParts[1])}月${parseInt(dateParts[2])}日`;
      return `
        <div class="reading-item">
          <div class="reading-item-header">
            <span class="reading-item-book">${this.escapeHtml(r.book)}</span>
            <span class="reading-item-pages">${r.pages}页</span>
          </div>
          ${r.note ? `<p class="reading-item-note">"${this.escapeHtml(r.note)}"</p>` : ''}
          <p class="reading-item-date">${dateLabel}</p>
        </div>
      `;
    }).join('');
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getHomeStatus() {
    const today = Storage.getReadingByDate(Storage.today());
    if (today) {
      return {
        text: `${today.book} · ${today.pages}页`,
        done: true
      };
    }
    return { text: '今日尚未记录', done: false };
  }
};

// 全局函数
function saveReading() { ReadingModule.save(); }
