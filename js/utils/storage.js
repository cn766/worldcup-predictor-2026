// localStorage 存取封装
const Storage = {
  KEY: 'wc2026_prediction',

  save() {
    try {
      const data = {
        groupRankings: State.groupRankings,
        knockoutPicks: State.knockoutPicks,
        champion: State.champion,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage 满或不可用，静默失败
      console.warn('无法保存预测进度:', e.message);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('无法读取预测进度:', e.message);
      return null;
    }
  },

  hasUnfinished() {
    const data = this.load();
    if (!data) return false;
    // 检查是否有未完成的预测（所有小组排名已调整但淘汰赛未完成）
    const groups = getGroupKeys();
    let groupsDone = 0;
    groups.forEach(g => {
      if (data.groupRankings && data.groupRankings[g] &&
          data.groupRankings[g].join(',') !== '0,1,2,3') {
        groupsDone++;
      }
    });
    // 如果有至少1组已完成，但没有冠军（淘汰赛未完成），则认为是半成品
    return groupsDone > 0 && !data.champion;
  },

  clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {
      // 静默失败
    }
  },

  restore() {
    const data = this.load();
    if (!data) return false;
    State.groupRankings = data.groupRankings || {};
    State.knockoutPicks = data.knockoutPicks || {};
    State.champion = data.champion || null;

    // 恢复小组排名默认值
    const groups = getGroupKeys();
    groups.forEach(g => {
      if (!State.groupRankings[g]) {
        State.groupRankings[g] = [0, 1, 2, 3];
      }
    });
    return true;
  }
};
