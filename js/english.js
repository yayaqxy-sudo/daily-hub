// 英语模块
const EnglishModule = {
  currentWordIdx: 0,
  todayWords: [],
  testWords: [],
  testIdx: 0,
  testCorrect: 0,
  currentBank: 'cet6',
  speechUtterance: null,

  init() {
    this.currentBank = getCurrentBank();
    this.updateBankUI();
    this.todayWords = getTodayWords(20);
    this.currentWordIdx = 0;
    this.renderWord();
    this.initTest();
    this.renderPassage();
  },

  // ===== 词库切换 =====
  switchBank(key) {
    this.currentBank = key;
    setCurrentBank(key);
    this.updateBankUI();
    // 重新加载今日单词
    this.todayWords = getTodayWords(20);
    this.currentWordIdx = 0;
    this.renderWord();
    this.initTest();
    const name = WORD_BANKS[key].name;
    showToast(`已切换到${name}词库（${WORD_BANKS[key].bank.length}词）`);
  },

  updateBankUI() {
    document.querySelectorAll('.bank-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bank === this.currentBank);
    });
    const bank = WORD_BANKS[this.currentBank];
    const countEl = document.getElementById('bank-count');
    if (bank && countEl) {
      countEl.textContent = `共${bank.bank.length}词`;
    }
  },

  // ===== 背单词 =====
  renderWord() {
    if (this.currentWordIdx >= this.todayWords.length) {
      this.currentWordIdx = 0;
    }
    const word = this.todayWords[this.currentWordIdx];
    document.getElementById('word-en').textContent = word.word;
    document.getElementById('word-phonetic').textContent = word.phonetic;
    document.getElementById('word-cn').textContent = word.meaning;
    document.getElementById('word-example-en').textContent = word.example;
    document.getElementById('word-example-cn').textContent = word.exampleTr;

    // 进度
    const progress = ((this.currentWordIdx + 1) / this.todayWords.length) * 100;
    document.getElementById('word-progress-text').textContent =
      `${this.currentWordIdx + 1} / ${this.todayWords.length}`;
    document.getElementById('word-progress-bar').style.width = progress + '%';
  },

  nextWord() {
    const word = this.todayWords[this.currentWordIdx];
    Storage.saveWordLearned(word.word);
    this.currentWordIdx++;
    if (this.currentWordIdx >= this.todayWords.length) {
      showToast('今日20个单词已全部完成！🎉');
      this.currentWordIdx = 0;
    }
    this.renderWord();
  },

  prevWord() {
    if (this.currentWordIdx > 0) {
      this.currentWordIdx--;
      this.renderWord();
    }
  },

  // Tab切换
  switchTab(tab) {
    document.querySelectorAll('.eng-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.eng-tab[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.eng-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`eng-panel-${tab}`).classList.add('active');

    if (tab === 'test') {
      this.initTest();
    }
  },

  // ===== 拼写测试 =====
  initTest() {
    this.testWords = [...this.todayWords].sort(() => Math.random() - 0.5);
    this.testIdx = 0;
    this.testCorrect = 0;
    this.renderTestWord();
    this.updateTestScore();
  },

  renderTestWord() {
    if (this.testIdx >= this.testWords.length) {
      document.getElementById('test-word-cn').textContent = '测试完成！';
      document.getElementById('test-input').style.display = 'none';
      document.querySelector('.test-actions').style.display = 'none';
      document.getElementById('test-feedback').textContent =
        `正确 ${this.testCorrect} / ${this.testWords.length}`;
      document.getElementById('test-feedback').className = 'test-feedback correct';
      Storage.saveTestScore(Storage.today(), this.testCorrect, this.testWords.length);
      return;
    }

    const word = this.testWords[this.testIdx];
    document.getElementById('test-word-cn').textContent = word.meaning;
    document.getElementById('test-input').value = '';
    document.getElementById('test-input').style.display = 'block';
    document.querySelector('.test-actions').style.display = 'flex';
    document.getElementById('test-feedback').textContent = '';
    document.getElementById('test-feedback').className = 'test-feedback';
    document.getElementById('test-input').focus();
  },

  submitTest() {
    const input = document.getElementById('test-input').value.trim().toLowerCase();
    const word = this.testWords[this.testIdx];
    const feedback = document.getElementById('test-feedback');

    if (input === word.word.toLowerCase()) {
      feedback.textContent = '✓ 正确！';
      feedback.className = 'test-feedback correct';
      this.testCorrect++;
    } else {
      feedback.textContent = `✗ 正确答案: ${word.word}`;
      feedback.className = 'test-feedback wrong';
    }

    this.updateTestScore();

    setTimeout(() => {
      this.testIdx++;
      this.renderTestWord();
    }, 1200);
  },

  skipWord() {
    this.testIdx++;
    this.renderTestWord();
  },

  updateTestScore() {
    const el = document.getElementById('test-score');
    if (this.testIdx < this.testWords.length) {
      el.textContent = `进度: ${this.testIdx} / ${this.testWords.length}  |  正确: ${this.testCorrect}`;
    }
  },

  // ===== 口语练习 =====
  renderPassage() {
    const passage = getTodayPassage();
    const typeEl = document.getElementById('passage-type');
    typeEl.textContent = passage.type === 'movie' ? '电影片段' : '每日段落';
    typeEl.className = 'passage-tag' + (passage.type === 'movie' ? ' movie' : '');
    document.getElementById('passage-title').textContent = passage.title;
    document.getElementById('passage-source').textContent = passage.source;
    document.getElementById('passage-en').textContent = passage.en;
    document.getElementById('passage-zh').textContent = passage.zh;
    Storage.saveSpeakDate(Storage.today());
  },

  // ===== 语音朗读 =====
  speakPassage(rate) {
    this.stopSpeaking();
    const text = document.getElementById('passage-en').textContent;
    if (!text || !window.speechSynthesis) {
      showToast('您的浏览器不支持语音朗读');
      return;
    }

    this.speechUtterance = new SpeechSynthesisUtterance(text);
    this.speechUtterance.lang = 'en-US';
    this.speechUtterance.rate = rate;
    this.speechUtterance.pitch = 1;

    // 尝试使用英语语音
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      this.speechUtterance.voice = enVoice;
    }

    window.speechSynthesis.speak(this.speechUtterance);
  },

  stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  // ===== 首页状态 =====
  getHomeStatus() {
    const todayStr = Storage.today();
    const data = Storage.getEnglishData();
    const learned = (data.learnedWords || []).length;
    const testScore = Storage.getTestScore(todayStr);
    const speakDates = data.speakDates || [];

    let parts = [];
    if (learned > 0) parts.push(`已学${learned}词`);
    if (testScore) parts.push(`测试${testScore.correct}/${testScore.total}`);
    if (speakDates.includes(todayStr)) parts.push('口语✓');

    return {
      text: parts.length > 0 ? parts.join(' · ') : '今日尚未开始',
      done: parts.length > 0
    };
  },

  getStreak() {
    let streak = 0;
    let date = new Date();
    const data = Storage.getEnglishData();
    const speakDates = data.speakDates || [];
    while (true) {
      const dateStr = Storage.formatDate(date);
      if (speakDates.includes(dateStr)) {
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
function switchEngTab(tab) { EnglishModule.switchTab(tab); }
function switchWordBank(key) { EnglishModule.switchBank(key); }
function nextWord() { EnglishModule.nextWord(); }
function prevWord() { EnglishModule.prevWord(); }
function submitTest() { EnglishModule.submitTest(); }
function skipWord() { EnglishModule.skipWord(); }
function speakPassage(rate) { EnglishModule.speakPassage(rate); }
function stopSpeaking() { EnglishModule.stopSpeaking(); }
