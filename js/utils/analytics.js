// 埋点上报
const Analytics = {
  events: [],

  track(eventName, data = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: data
    };
    this.events.push(event);
    // 同时存到localStorage（为后续上报准备）
    try {
      const stored = JSON.parse(localStorage.getItem('wc2026_analytics') || '[]');
      stored.push(event);
      // 只保留最近1000条
      if (stored.length > 1000) stored.splice(0, stored.length - 1000);
      localStorage.setItem('wc2026_analytics', JSON.stringify(stored));
    } catch (e) {
      // 静默失败
    }
    console.log('[埋点]', eventName, data);
  },

  pageView() {
    this.track('page_view', { screen: State.currentScreen });
  },

  startPrediction() {
    this.track('start_core_action', { type: 'custom_prediction' });
  },

  viewResult() {
    this.track('view_result', {
      champion: State.champion ? resolveTeam(State.champion)?.name : null
    });
  },

  share(type) {
    this.track('share', { share_type: type });
  },

  getStats() {
    return {
      totalPageViews: this.events.filter(e => e.event === 'page_view').length,
      totalPredictions: this.events.filter(e => e.event === 'start_core_action').length,
      totalResults: this.events.filter(e => e.event === 'view_result').length,
      totalShares: this.events.filter(e => e.event === 'share').length
    };
  }
};
