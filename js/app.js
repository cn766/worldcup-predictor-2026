// 主应用控制器
const App = {
  init() {
    // 初始化状态
    State.init();

    // 检查是否有未完成的预测
    const hasUnfinished = Storage.hasUnfinished();
    if (hasUnfinished) {
      this.showRestoreDialog();
    } else {
      // 生成随机预测并展示
      generateRandomPrediction();
      this.showScreen('aha');
      AhaPage.render();
    }

    // 监听页面可见性变化（用户切换回页面时）
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 用户回到页面，可以在这里刷新数据
      }
    });

    // 页面埋点
    Analytics.pageView();
  },

  showRestoreDialog() {
    const restored = Storage.restore();
    if (restored) {
      // 简单弹窗询问
      const shouldRestore = confirm(i18n.restoreMsg + '\n\n选择"确定"继续预测，"取消"重新开始');
      if (shouldRestore) {
        // 判断预测进度，进入对应屏幕
        if (State.champion) {
          this.showResult();
        } else if (this.areGroupsDone()) {
          this.goToKnockout();
        } else {
          this.showScreen('groups');
          GroupsPage.render();
        }
        return;
      }
    }
    // 不恢复，重新开始
    State.init();
    Storage.clear();
    generateRandomPrediction();
    this.showScreen('aha');
    AhaPage.render();
  },

  areGroupsDone() {
    const groups = getGroupKeys();
    return groups.every(g => {
      const r = State.groupRankings[g];
      return r && r.join(',') !== '0,1,2,3';
    });
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    State.currentScreen = name;
    window.scrollTo(0, 0);
  },

  refreshRandom() {
    generateRandomPrediction();
    Storage.clear();
    this.showScreen('aha');
    AhaPage.render();
  },

  startCustom() {
    State.init();
    State.isRandomPrediction = false;
    Analytics.startPrediction();
    this.showScreen('groups');
    GroupsPage.render();
  },

  goToKnockout() {
    State.knockoutPicks = {};
    State.champion = null;
    State.currentRound = 0;
    this.showScreen('bracket');
    BracketPage.render();
    Storage.save();
  },

  showResult() {
    this.showScreen('result');
    ResultPage.render();
  },

  showShare() {
    this.showScreen('share');
    SharePage.render();
  },

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
