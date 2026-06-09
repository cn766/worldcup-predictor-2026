// 预测引擎：随机预测 + 最佳第3名计算

// 随机排列数组（Fisher-Yates shuffle）
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 生成随机预测
function generateRandomPrediction() {
  State.init();

  // 1. 随机排列每组排名
  const groups = getGroupKeys();
  groups.forEach(g => {
    State.groupRankings[g] = shuffle([0, 1, 2, 3]);
  });

  // 2. 计算最佳第3名
  const bestThirds = selectBestThirds();

  // 3. 构建32强选手池
  let pool = [];
  groups.forEach(g => {
    pool.push({ group: g, pos: 0 }); // 小组第1
    pool.push({ group: g, pos: 1 }); // 小组第2
  });
  bestThirds.forEach(t => {
    pool.push({ group: t.group, pos: 2 }); // 最佳第3名
  });

  // 4. 随机对阵结果
  const matchCounts = [16, 8, 4, 2, 1];
  let currentPool = shuffle([...pool]); // 随机打乱32强

  matchCounts.forEach((matchCount, round) => {
    const winners = [];
    for (let m = 0; m < matchCount; m++) {
      const t1 = currentPool[m * 2];
      const t2 = currentPool[m * 2 + 1];
      if (t1 && t2) {
        winners.push(Math.random() > 0.5 ? t1 : t2);
      }
    }
    State.knockoutPicks[round] = winners;
    currentPool = winners;
  });

  // 5. 设置冠军
  if (State.knockoutPicks[4] && State.knockoutPicks[4][0]) {
    State.champion = State.knockoutPicks[4][0];
  }

  State.isRandomPrediction = true;
}

// 计算最佳8个第3名
// 规则：12个小组第3名 → 按积分→净胜球→进球数排序 → 取前8名
// 简化版：使用FIFA排名作为排序依据（FIFA排名越低越强）
function selectBestThirds() {
  const thirds = getAllThirdPlaceTeams();
  // 按FIFA排名从低到高排序（排名数字越小越强）
  thirds.sort((a, b) => (a.fifa || 999) - (b.fifa || 999));
  return thirds.slice(0, 8);
}

// 获取淘汰赛参与队伍
function getKnockoutParticipants() {
  const participants = [];
  const groups = getGroupKeys();
  const bestThirds = selectBestThirds();
  const bestThirdGroups = new Set(bestThirds.map(t => t.group));

  groups.forEach(g => {
    // 小组第1
    const first = getTeam(g, 0);
    if (first) participants.push({ ...first, from: g + '组第1' });
    // 小组第2
    const second = getTeam(g, 1);
    if (second) participants.push({ ...second, from: g + '组第2' });
  });

  // 最佳第3名
  bestThirds.forEach(t => {
    participants.push({ ...t, from: '最佳第3名' });
  });

  return participants;
}
