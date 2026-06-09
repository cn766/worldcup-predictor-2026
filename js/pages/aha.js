// 啊哈时刻首页
const AhaPage = {
  render() {
    const container = document.getElementById('screen-aha');
    const champ = State.champion ? resolveTeam(State.champion) : null;
    const flag = champ ? champ.flag : '🇧🇷';
    const name = champ ? champ.name : '巴西';

    // 获取亚军和季军
    let silver = null, bronze = null;
    if (State.knockoutPicks[4] && State.knockoutPicks[4].length >= 2) {
      silver = resolveTeam(State.knockoutPicks[4][1]);
    }
    if (State.knockoutPicks[3]) {
      const semis = State.knockoutPicks[3];
      const finalists = State.knockoutPicks[4] || [];
      for (const semi of semis) {
        const isInFinal = finalists.some(f => f && f.group === semi.group && f.pos === semi.pos);
        if (!isInFinal) {
          bronze = resolveTeam(semi);
          break;
        }
      }
    }

    container.innerHTML = `
      <div class="aha-screen">
        <div class="aha-champion">
          <span class="champion-crown">${i18n.ahaCrown}</span>
          <span class="champion-flag">${flag}</span>
          <div class="champion-name">${name}</div>
          <div class="champion-label">${i18n.ahaLabel}</div>
        </div>
        <div class="aha-quick-preview">
          <div class="preview-row">
            <span class="medal">🥇</span><span>${name}</span>
            <span class="medal">🥈</span><span>${silver ? silver.name : '——'}</span>
            <span class="medal">🥉</span><span>${bronze ? bronze.name : '——'}</span>
          </div>
          <div class="divider"></div>
          <div class="preview-label">以上为随机生成的示例预测</div>
        </div>
        <button class="btn btn-gold" onclick="App.showShare()">${i18n.ahaShare}</button>
        <button class="btn btn-primary" onclick="App.startCustom()">${i18n.ahaCustom}</button>
        <button class="btn-refresh" onclick="App.refreshRandom()">${i18n.ahaRefresh}</button>
      </div>
    `;
  }
};
