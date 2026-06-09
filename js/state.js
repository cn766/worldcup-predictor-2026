// 全局状态管理
const State = {
  // 小组排名：{ 'A': [0,1,2,3], 'B': [0,1,2,3], ... }
  // 每个值代表 teams.json 中该组的队伍索引
  groupRankings: {},

  // 淘汰赛选择：{ 0: [winner1, winner2, ...16个], 1: [...8个], ... 4: [champion] }
  // 每轮存储的是 teams.json 中的队伍引用 { group, pos }
  knockoutPicks: {},

  // 当前淘汰赛轮次 (0=32强, 1=16强, 2=8强, 3=半决赛, 4=决赛)
  currentRound: 0,

  // 选中的冠军
  champion: null,

  // 小组排名交互中的选中状态
  selectedTeam: null, // { group, pos }

  // 当前活跃的屏幕
  currentScreen: 'aha',

  // 是否来自随机预测
  isRandomPrediction: true,

  // 初始化：将12个小组的排名都设为默认顺序 [0,1,2,3]
  init() {
    const groups = getGroupKeys();
    groups.forEach(g => {
      this.groupRankings[g] = [0, 1, 2, 3];
    });
    this.knockoutPicks = {};
    this.currentRound = 0;
    this.champion = null;
    this.selectedTeam = null;
    this.currentScreen = 'aha';
    this.isRandomPrediction = true;
  }
};
