// 球队数据查询函数
// 数据源：data/teams.json（通过 index.html 中的 <script> 标签加载为 TEAMS_DATA）

function getGroupKeys() {
  return Object.keys(TEAMS_DATA);
}

function getTeams(group) {
  return TEAMS_DATA[group] || [];
}

function getTeam(group, pos) {
  const teams = TEAMS_DATA[group];
  if (!teams) return null;
  const idx = State.groupRankings[group] ? State.groupRankings[group][pos] : pos;
  const team = teams[idx];
  if (!team) return null;
  return {
    ...team,
    group: group,
    pos: pos,
    idx: idx
  };
}

function getTeamRaw(group, teamIdx) {
  const teams = TEAMS_DATA[group];
  if (!teams || teamIdx >= teams.length) return null;
  return {
    ...teams[teamIdx],
    group: group,
    idx: teamIdx
  };
}

// 根据 { group, pos } 获取队伍信息
function resolveTeam(ref) {
  if (!ref) return null;
  return getTeam(ref.group, ref.pos);
}

// 获取所有小组的第3名队伍
function getAllThirdPlaceTeams() {
  const thirds = [];
  getGroupKeys().forEach(g => {
    const team = getTeam(g, 2); // 排名第3（索引2）
    if (team) {
      thirds.push(team);
    }
  });
  return thirds;
}
