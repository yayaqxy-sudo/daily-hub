// 名言模块
const QuoteModule = {
  init() {
    this.renderTodayQuote();
  },

  renderTodayQuote() {
    const quote = getTodayQuote();
    document.getElementById('quote-text').textContent = quote.text;
    document.getElementById('quote-author').textContent = `— ${quote.author}`;
  },

  showAll() {
    const modal = document.getElementById('quote-list-modal');
    modal.innerHTML = QUOTES.map(q => `
      <div class="quote-list-item">
        <p>${q.text}</p>
        <p>— ${q.author}</p>
      </div>
    `).join('');
    document.getElementById('quote-modal').classList.add('show');
  }
};

function showAllQuotes() { QuoteModule.showAll(); }
