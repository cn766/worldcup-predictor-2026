// 埋点上报 - 支持本地存储 + Cloudflare Analytics + Beacon上报
const Analytics = {
  events: [],
  // Cloudflare Web Analytics token（如果配置了则自动启用）
  _cfBeacon: 'https://cloudflareinsights.com/cdn-cgi/rum',

  track(eventName, data = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: data,
      // 附加页面上下文
      context: {
        url: location.href,
        screen: typeof State !== 'undefined' ? State.currentScreen : null,
        referrer: document.referrer || null
      }
    };
    this.events.push(event);
    
    // 存到localStorage（最多1000条）
    try {
      const stored = JSON.parse(localStorage.getItem('wc2026_analytics') || '[]');
      stored.push(event);
      if (stored.length > 1000) stored.splice(0, stored.length - 1000);
      localStorage.setItem('wc2026_analytics', JSON.stringify(stored));
    } catch (e) {
      // 静默失败
    }

    // Beacon上报（如果浏览器支持）
    if (navigator.sendBeacon) {
      try {
        const payload = JSON.stringify({
          n: eventName,
          d: data,
          t: event.timestamp,
          u: location.pathname
        });
        // 尝试发送到Cloudflare Analytics（由Cloudflare Pages自动处理）
        navigator.sendBeacon('/cdn-cgi/rum?' + encodeURIComponent(payload), '');
      } catch (e) {
        // Beacon发送失败不影响主流程
      }
    }

    // 控制台日志（开发调试用，生产环境可关闭）
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('[埋点]', eventName, data);
    }
  },

  pageView() {
    this.track('page_view', { screen: typeof State !== 'undefined' ? State.currentScreen : 'unknown' });
  },

  startPrediction() {
    this.track('start_core_action', { type: 'custom_prediction' });
  },

  viewResult() {
    const champion = (typeof State !== 'undefined' && State.champion)
      ? (typeof resolveTeam === 'function' ? resolveTeam(State.champion)?.name : null)
      : null;
    this.track('view_result', { champion: champion });
  },

  share(type) {
    this.track('share', {
      share_type: type,
      // 记录分享时的冠军信息
      champion: (typeof State !== 'undefined' && State.champion)
        ? (typeof resolveTeam === 'function' ? resolveTeam(State.champion)?.name : null)
        : null
    });
    // 分享是最高价值事件，额外尝试发送beacon
    if (navigator.sendBeacon) {
      try {
        const sharePayload = JSON.stringify({
          event: 'share',
          type: type,
          champion: (typeof State !== 'undefined' && State.champion)
            ? (typeof resolveTeam === 'function' ? resolveTeam(State.champion)?.name : null)
            : null,
          time: Date.now()
        });
        navigator.sendBeacon('/api/analytics/share', sharePayload);
      } catch (e) {
        // 静默
      }
    }
  },

  // 获取本地统计数据摘要
  getStats() {
    return {
      totalPageViews: this.events.filter(e => e.event === 'page_view').length,
      totalPredictions: this.events.filter(e => e.event === 'start_core_action').length,
      totalResults: this.events.filter(e => e.event === 'view_result').length,
      totalShares: this.events.filter(e => e.event === 'share').length,
      // 分享渠道分布
      shareByType: this.events
        .filter(e => e.event === 'share')
        .reduce((acc, e) => {
          acc[e.data.share_type] = (acc[e.data.share_type] || 0) + 1;
          return acc;
        }, {}),
      // 最受欢迎的冠军预测Top5
      topChampions: this._topChampions()
    };
  },

  _topChampions() {
    const champions = this.events
      .filter(e => e.event === 'view_result' && e.data.champion)
      .map(e => e.data.champion);
    const counts = {};
    champions.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  },

  // 导出本地数据（可用于调试或手动分析）
  exportData() {
    return {
      stats: this.getStats(),
      events: this.events.slice(-100), // 最近100条
      exportedAt: new Date().toISOString()
    };
  }
};
