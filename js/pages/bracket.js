// 淘汰赛对阵图页面
const BracketPage = {
  render() {
    const container = document.getElementById('screen-bracket');
    const participants = getKnockoutParticipants();
    let html = '';

    // 进度
    let totalDone = 0;
    const totalMatches = 16 + 8 + 4 + 2 + 1;
    for (let ri = 0; ri <= State.currentRound; ri++) {
      totalDone += (State.knockoutPicks[ri] || []).filter(Boolean).length;
    }
    const pct = Math.round((totalDone / totalMatches) * 100);

    // 渲染每轮
    for (let ri = 0; ri <= State.currentRound; ri++) {
      const matchCount = i18n.roundMatches[ri];
      let sourcePool;
      if (ri === 0) {
        sourcePool = participants;
      } else {
        sourcePool = State.knockoutPicks[ri - 1] || [];
      }
      const winners = State.knockoutPicks[ri] || [];

      html += `<div class="round-label">${i18n.roundNames[ri]}（${matchCount}场比赛）</div>`;

      for (let m = 0; m < matchCount; m++) {
        const t1 = sourcePool[m * 2] ? resolveTeam(sourcePool[m * 2]) : null;
        const t2 = sourcePool[m * 2 + 1] ? resolveTeam(sourcePool[m * 2 + 1]) : null;
        const picked = winners[m] || null;
        const t1Picked = picked && t1 && picked.group === t1.group && picked.pos === t1.pos;
        const t2Picked = picked && t2 && picked.group === t2.group && picked.pos === t2.pos;

        html += `<div class="bracket-match ${picked ? 'picked' : ''}">`;
        html += `<div class="match-team" onclick="BracketPage.pick(${ri},${m},0)" style="${t1Picked ? 'font-weight:800;color:var(--accent)' : ''}">`;
        html += `<span class="match-flag">${t1 ? t1.flag : '❓'}</span>`;
        html += `<span class="match-name">${t1 ? t1.name : i18n.bracketTBD}</span></div>`;
        html += `<div class="match-vs">${i18n.bracketVS}</div>`;
        html += `<div class="match-team right" onclick="BracketPage.pick(${ri},${m},1)" style="${t2Picked ? 'font-weight:800;color:var(--accent)' : ''}">`;
        html += `<span class="match-name">${t2 ? t2.name : i18n.bracketTBD}</span>`;
        html += `<span class="match-flag">${t2 ? t2.flag : '❓'}</span></div>`;
        html += `<span class="winner-mark">${picked ? '✅' : ''}</span>`;
        html += `</div>`;
      }
    }

    const allDone = State.knockoutPicks[4] && State.knockoutPicks[4][0];

    container.innerHTML = `
      <div class="bracket-header">
        <h2>${i18n.bracketTitle}</h2>
        <div class="step-indicator">${i18n.bracketHint}</div>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      <div id="bracket-content">${html}</div>
      ${allDone ? `<button class="btn btn-gold" onclick="App.showResult()">${i18n.bracketDone}</button>` : ''}
    `;
  },

  pick(roundIdx, matchIdx, sideIdx) {
    if (!State.knockoutPicks[roundIdx]) State.knockoutPicks[roundIdx] = [];

    const participants = getKnockoutParticipants();
    let sourcePool = roundIdx === 0 ? participants : (State.knockoutPicks[roundIdx - 1] || []);
    const winner = sourcePool[matchIdx * 2 + sideIdx];
    if (!winner) return;

    State.knockoutPicks[roundIdx][matchIdx] = winner;

    // 本轮所有比赛都选完了，进入下一轮
    const matchCount = i18n.roundMatches[roundIdx];
    if (State.knockoutPicks[roundIdx].filter(Boolean).length >= matchCount) {
      if (roundIdx < 4) {
        State.currentRound = roundIdx + 1;
      }
    }

    // 冠军产生
    if (roundIdx === 4) {
      State.champion = winner;
    }

    Storage.save();
    this.render();
  }
};
