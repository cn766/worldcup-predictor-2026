// 小组排名页面
const GroupsPage = {
  currentGroup: 'A',

  render() {
    const container = document.getElementById('screen-groups');
    const groups = getGroupKeys();

    // 进度条
    let done = 0;
    groups.forEach(g => {
      const ranking = State.groupRankings[g];
      if (ranking && ranking.join(',') !== '0,1,2,3') done++;
    });
    const pct = Math.round((done / 12) * 100);

    // 分组Tab
    let tabsHtml = '';
    groups.forEach(g => {
      const ranking = State.groupRankings[g] || [0,1,2,3];
      const isDone = ranking.join(',') !== '0,1,2,3';
      tabsHtml += `<button class="group-tab ${g === this.currentGroup ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="GroupsPage.switchTo('${g}')">${g}</button>`;
    });

    // 当前组面板
    const panelHtml = this.renderGroupPanel(this.currentGroup);

    container.innerHTML = `
      <div class="groups-header">
        <h2>${i18n.groupsTitle}</h2>
        <div class="step-indicator">${i18n.groupsHint}</div>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
      <div class="group-tabs">${tabsHtml}</div>
      <div id="group-panels">${panelHtml}</div>
      ${done >= 12 ? `<button class="btn btn-primary" onclick="App.goToKnockout()">${i18n.groupsDone}</button>` : ''}
    `;

    State.selectedTeam = null;
  },

  renderGroupPanel(g) {
    const teams = getTeams(g);
    const ranking = State.groupRankings[g] || [0,1,2,3];

    let html = `<div class="group-panel active" id="panel-${g}">`;
    ranking.forEach((teamIdx, rank) => {
      const team = teams[teamIdx];
      if (!team) return;
      const posClass = rank === 0 ? 'pos-1' : rank === 1 ? 'pos-2' : rank === 2 ? 'pos-3' : '';
      const badge = rank < 2
        ? '<span class="advance-badge">' + i18n.groupsAdvance + '</span>'
        : rank === 2
        ? '<span class="third-badge">' + i18n.groupsPending + '</span>'
        : '';
      const sel = State.selectedTeam;
      const isSelected = sel && sel.group === g && sel.pos === rank;

      html += `
        <div class="team-row ${isSelected ? 'selected' : ''}" onclick="GroupsPage.selectTeam('${g}',${rank})">
          <div class="rank-num ${posClass}">${rank + 1}</div>
          <div class="team-flag">${team.flag}</div>
          <div class="team-info">
            <div class="team-name">${team.name}</div>
            <div class="team-rank">FIFA 排名 ${team.fifa}</div>
          </div>
          ${badge}
          <div class="swap-hint">点击交换</div>
        </div>`;
    });
    html += '</div>';
    return html;
  },

  switchTo(g) {
    this.currentGroup = g;
    State.selectedTeam = null;
    this.render();
  },

  selectTeam(g, pos) {
    if (!State.selectedTeam) {
      State.selectedTeam = { group: g, pos: pos };
      this.render();
    } else {
      const sel = State.selectedTeam;
      if (sel.group === g && sel.pos === pos) {
        State.selectedTeam = null;
        this.render();
      } else {
        // 交换排名
        const arr1 = State.groupRankings[sel.group];
        const arr2 = State.groupRankings[g];
        const temp = arr1[sel.pos];
        arr1[sel.pos] = arr2[pos];
        arr2[pos] = temp;

        State.selectedTeam = null;
        this.currentGroup = g;
        this.render();
        Storage.save();
      }
    }
  }
};
