// 本地存储封装 - 基于 localStorage
const Storage = {
  // 通用读取
  get(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : (defaultValue || null);
    } catch (e) {
      return defaultValue || null;
    }
  },

  // 通用写入
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // 通用删除
  remove(key) {
    localStorage.removeItem(key);
  },

  // 获取今日日期字符串 YYYY-MM-DD
  today() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  // 格式化日期
  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  // 获取月份字符串
  monthStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  },

  // ===== 运动数据 =====
  getExerciseData() {
    return this.get('exercise_data', {});
  },

  saveExerciseCheck(dateStr, type, item, checked) {
    const data = this.getExerciseData();
    if (!data[dateStr]) data[dateStr] = { cardio: [], strength: [] };
    if (!data[dateStr][type]) data[dateStr][type] = [];

    if (checked) {
      if (!data[dateStr][type].includes(item)) {
        data[dateStr][type].push(item);
      }
    } else {
      data[dateStr][type] = data[dateStr][type].filter(i => i !== item);
    }

    this.set('exercise_data', data);
  },

  getExerciseByDate(dateStr) {
    const data = this.getExerciseData();
    return data[dateStr] || { cardio: [], strength: [] };
  },

  // ===== 英语数据 =====
  getEnglishData() {
    return this.get('english_data', { learnedWords: [], testScores: {}, speakDates: [] });
  },

  saveWordLearned(word) {
    const data = this.getEnglishData();
    if (!data.learnedWords) data.learnedWords = [];
    if (!data.learnedWords.includes(word)) {
      data.learnedWords.push(word);
    }
    this.set('english_data', data);
  },

  saveTestScore(dateStr, correct, total) {
    const data = this.getEnglishData();
    if (!data.testScores) data.testScores = {};
    data.testScores[dateStr] = { correct, total };
    this.set('english_data', data);
  },

  getTestScore(dateStr) {
    const data = this.getEnglishData();
    return (data.testScores || {})[dateStr] || null;
  },

  saveSpeakDate(dateStr) {
    const data = this.getEnglishData();
    if (!data.speakDates) data.speakDates = [];
    if (!data.speakDates.includes(dateStr)) {
      data.speakDates.push(dateStr);
    }
    this.set('english_data', data);
  },

  // ===== 饮食数据 =====
  getDietData() {
    return this.get('diet_data', { meals: {}, water: {}, weights: [] });
  },

  saveMealPhoto(dateStr, mealType, photoData) {
    const data = this.getDietData();
    if (!data.meals) data.meals = {};
    if (!data.meals[dateStr]) data.meals[dateStr] = {};
    data.meals[dateStr][mealType] = photoData;
    this.set('diet_data', data);
  },

  getMealsByDate(dateStr) {
    const data = this.getDietData();
    return (data.meals || {})[dateStr] || {};
  },

  getWater(dateStr) {
    const data = this.getDietData();
    return (data.water || {})[dateStr] || 0;
  },

  setWater(dateStr, amount) {
    const data = this.getDietData();
    if (!data.water) data.water = {};
    data.water[dateStr] = amount;
    this.set('diet_data', data);
  },

  saveWeight(dateStr, weight) {
    const data = this.getDietData();
    if (!data.weights) data.weights = [];
    // 查找同一天的记录，更新它
    const idx = data.weights.findIndex(w => w.date === dateStr);
    if (idx >= 0) {
      data.weights[idx].weight = weight;
    } else {
      data.weights.push({ date: dateStr, weight: weight });
    }
    // 按日期排序
    data.weights.sort((a, b) => a.date.localeCompare(b.date));
    this.set('diet_data', data);
  },

  getWeights() {
    const data = this.getDietData();
    return data.weights || [];
  },

  // ===== 阅读数据 =====
  getReadingData() {
    return this.get('reading_data', []);
  },

  saveReading(dateStr, book, pages, note) {
    const data = this.getReadingData();
    const idx = data.findIndex(r => r.date === dateStr);
    if (idx >= 0) {
      data[idx] = { date: dateStr, book, pages, note };
    } else {
      data.push({ date: dateStr, book, pages, note });
      data.sort((a, b) => a.date.localeCompare(b.date));
    }
    this.set('reading_data', data);
  },

  getReadingByDate(dateStr) {
    const data = this.getReadingData();
    return data.find(r => r.date === dateStr);
  },

  // ===== 记账数据 =====
  getAccountData() {
    return this.get('account_data', []);
  },

  saveAccount(dateStr, type, amount, category, note) {
    const data = this.getAccountData();
    const entry = {
      id: Date.now(),
      date: dateStr,
      type: type,
      amount: parseFloat(amount),
      category: category,
      note: note,
      time: new Date().toTimeString().slice(0, 5)
    };
    data.push(entry);
    this.set('account_data', data);
  },

  deleteAccount(id) {
    const data = this.getAccountData();
    const filtered = data.filter(a => a.id !== id);
    this.set('account_data', filtered);
  },

  getAccountByDate(dateStr) {
    const data = this.getAccountData();
    return data.filter(a => a.date === dateStr);
  },

  getAccountByMonth(monthStr) {
    const data = this.getAccountData();
    return data.filter(a => a.date.startsWith(monthStr));
  },

  // ===== 导出数据 =====
  exportAll() {
    return {
      exercise: this.getExerciseData(),
      english: this.getEnglishData(),
      diet: this.getDietData(),
      reading: this.getReadingData(),
      account: this.getAccountData(),
      exportDate: new Date().toISOString()
    };
  }
};
