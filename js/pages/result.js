// 结果展示页面
const ResultPage = {
  render() {
    const container = document.getElementById('screen-result');
    const champ = State.champion ? resolveTeam(State.champion) : null;
    if (!champ) return;

    let silverName = '——';
    if (State.knockoutPicks[4] && State.knockoutPicks[4][1]) {
      const s = resolveTeam(State.knockoutPicks[4][1]);
      if (s) silverName = s.name;
    }

    const shareCount = Math.floor(Math.random() * 5000) + 10000;

    container.innerHTML = `
      <div class="result-screen">
        <div class="result-hero">
          <div class="result-crown">${i18n.resultCrown}</div>
          <div class="result-flag">${champ.flag}</div>
          <div class="result-name">${champ.name}</div>
          <div style="color:var(--text-muted);font-size:14px;">${i18n.resultChampion}</div>
        </div>
        <div class="result-bracket-preview">
          <div style="font-size:14px;font-weight:700;margin-bottom:12px;">${i18n.resultDetail}</div>
          <div class="result-row">
            <span class="r-label">${i18n.resultChampionLabel}</span>
            <span class="r-flag">${champ.flag}</span>
            <span class="r-name">${champ.name}</span>
          </div>
          <div class="result-row">
            <span class="r-label">${i18n.resultRunnerUp}</span>
            <span class="r-flag">🥈</span>
            <span class="r-name">${silverName}</span>
          </div>
        </div>
        <div class="social-proof">${i18n.socialProof.replace('{count}', shareCount.toLocaleString())}</div>
        <button class="btn btn-gold" onclick="App.showShare()">${i18n.resultShare}</button>
        <button class="btn btn-outline" onclick="App.refreshRandom()">${i18n.resultRetry}</button>
      </div>
    `;

    Analytics.viewResult();
  }
};
