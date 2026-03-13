const ATTRIBUTES = ["looks", "intelligence", "health", "wealth"];

const ATTR_LABELS = {
  looks: "颜值",
  intelligence: "智力",
  health: "体质",
  wealth: "家境",
};

const AGE_STAGES = [
  { min: 0, max: 3, label: "婴幼儿" },
  { min: 4, max: 6, label: "幼儿园" },
  { min: 7, max: 12, label: "小学" },
  { min: 13, max: 15, label: "初中" },
  { min: 16, max: 18, label: "高中" },
  { min: 19, max: 22, label: "大学" },
  { min: 23, max: 30, label: "初入社会" },
  { min: 31, max: 45, label: "中年" },
  { min: 46, max: 60, label: "中晚年" },
  { min: 61, max: 80, label: "晚年" },
  { min: 81, max: 100, label: "高寿" },
];

function getStageLabel(age) {
  const stage = AGE_STAGES.find((s) => age >= s.min && age <= s.max);
  return stage ? stage.label : "未知";
}

const EVENTS_POOL = [
  // 婴幼儿 0-3
  { ageMin: 0, ageMax: 0, text: "你出生了", effects: {}, tags: ["birth"] },
  { ageMin: 1, ageMax: 2, text: "学会了走路", effects: { health: 1 }, tags: ["milestone"] },
  { ageMin: 1, ageMax: 3, text: "生了一场大病", effects: { health: -2 }, tags: ["illness"] },
  { ageMin: 2, ageMax: 3, text: "学会了说话，特别能聊", effects: { intelligence: 1 }, tags: ["milestone"] },
  { ageMin: 1, ageMax: 3, text: "父母给你报了早教班", effects: { intelligence: 1, wealth: -1 }, tags: ["education"] },

  // 幼儿园 4-6
  { ageMin: 4, ageMax: 6, text: "在幼儿园交到了好朋友", effects: { looks: 1 }, tags: ["social"] },
  { ageMin: 4, ageMax: 6, text: "被小朋友欺负了", effects: { health: -1 }, tags: ["conflict"] },
  { ageMin: 4, ageMax: 6, text: "展现了绘画天赋", effects: { intelligence: 2 }, tags: ["talent"] },
  { ageMin: 4, ageMax: 6, text: "家里买了新房子", effects: { wealth: 2 }, tags: ["family"] },
  { ageMin: 4, ageMax: 6, text: "爸妈吵架了", effects: { health: -1, intelligence: -1 }, tags: ["family"] },

  // 小学 7-12
  { ageMin: 7, ageMax: 12, text: "考试得了全班第一", effects: { intelligence: 2 }, tags: ["study"] },
  { ageMin: 7, ageMax: 12, text: "近视了，戴上了眼镜", effects: { looks: -1, intelligence: 1 }, tags: ["health"] },
  { ageMin: 7, ageMax: 12, text: "学会了游泳", effects: { health: 2 }, tags: ["sport"] },
  { ageMin: 7, ageMax: 12, text: "被选为班长", effects: { intelligence: 1, looks: 1 }, tags: ["social"] },
  { ageMin: 7, ageMax: 12, text: "家里的生意失败了", effects: { wealth: -3 }, tags: ["family"] },
  { ageMin: 7, ageMax: 12, text: "获得了奥数比赛奖牌", effects: { intelligence: 3 }, tags: ["competition"] },
  { ageMin: 7, ageMax: 12, text: "沉迷游戏，成绩下滑", effects: { intelligence: -2, health: -1 }, tags: ["gaming"] },
  { ageMin: 7, ageMax: 12, text: "父母离婚了", effects: { wealth: -2, health: -1 }, tags: ["family"] },
  { ageMin: 10, ageMax: 12, text: "开始发育，长高了不少", effects: { looks: 1, health: 1 }, tags: ["growth"] },

  // 初中 13-15
  { ageMin: 13, ageMax: 15, text: "暗恋了一个同学", effects: { looks: 1 }, tags: ["love"] },
  { ageMin: 13, ageMax: 15, text: "中考超常发挥", effects: { intelligence: 3 }, tags: ["exam"] },
  { ageMin: 13, ageMax: 15, text: "中考失利", effects: { intelligence: -2, health: -1 }, tags: ["exam"] },
  { ageMin: 13, ageMax: 15, text: "参加篮球队", effects: { health: 2, looks: 1 }, tags: ["sport"] },
  { ageMin: 13, ageMax: 15, text: "遇到了改变你一生的好老师", effects: { intelligence: 2, health: 1 }, tags: ["mentor"] },
  { ageMin: 13, ageMax: 15, text: "被校园霸凌", effects: { health: -2, looks: -1 }, tags: ["conflict"] },
  { ageMin: 13, ageMax: 15, text: "爷爷/奶奶去世了", effects: { health: -1 }, tags: ["family"] },

  // 高中 16-18
  { ageMin: 16, ageMax: 18, text: "谈了第一次恋爱", effects: { looks: 1 }, tags: ["love"] },
  { ageMin: 16, ageMax: 18, text: "高考超常发挥，考上名校", effects: { intelligence: 3, wealth: 1 }, tags: ["exam"] },
  { ageMin: 16, ageMax: 18, text: "高考发挥失常", effects: { intelligence: -2 }, tags: ["exam"] },
  { ageMin: 16, ageMax: 18, text: "获得省级竞赛一等奖", effects: { intelligence: 3 }, tags: ["competition"] },
  { ageMin: 16, ageMax: 18, text: "熬夜学习，身体垮了", effects: { health: -2, intelligence: 1 }, tags: ["study"] },
  { ageMin: 16, ageMax: 18, text: "失恋了，心碎了一地", effects: { looks: -1, health: -1 }, tags: ["love"] },
  { ageMin: 16, ageMax: 18, text: "家里中了彩票", effects: { wealth: 5 }, tags: ["luck"] },

  // 大学 19-22
  { ageMin: 19, ageMax: 22, text: "拿到了奖学金", effects: { intelligence: 2, wealth: 1 }, tags: ["study"] },
  { ageMin: 19, ageMax: 22, text: "开始健身，身材变好了", effects: { looks: 2, health: 2 }, tags: ["sport"] },
  { ageMin: 19, ageMax: 22, text: "创业失败，亏了一笔钱", effects: { wealth: -3, intelligence: 1 }, tags: ["career"] },
  { ageMin: 19, ageMax: 22, text: "出国交换学习", effects: { intelligence: 2, wealth: -2 }, tags: ["education"] },
  { ageMin: 19, ageMax: 22, text: "室友关系很差", effects: { health: -1 }, tags: ["social"] },
  { ageMin: 19, ageMax: 22, text: "参加实习，学到很多", effects: { intelligence: 2, wealth: 1 }, tags: ["career"] },
  { ageMin: 19, ageMax: 22, text: "遇到了人生伴侣", effects: { looks: 1, health: 1 }, tags: ["love"] },
  { ageMin: 19, ageMax: 22, text: "沉迷追剧，挂了好几科", effects: { intelligence: -3 }, tags: ["gaming"] },

  // 初入社会 23-30
  { ageMin: 23, ageMax: 30, text: "找到了满意的工作", effects: { wealth: 2, intelligence: 1 }, tags: ["career"] },
  { ageMin: 23, ageMax: 30, text: "被裁员了", effects: { wealth: -3, health: -1 }, tags: ["career"] },
  { ageMin: 23, ageMax: 30, text: "升职加薪", effects: { wealth: 3, intelligence: 1 }, tags: ["career"] },
  { ageMin: 23, ageMax: 30, text: "结婚了", effects: { looks: 1, wealth: -2 }, tags: ["love"] },
  { ageMin: 23, ageMax: 30, text: "买了人生第一套房", effects: { wealth: -5, health: -1 }, tags: ["property"] },
  { ageMin: 23, ageMax: 30, text: "创业成功，赚到第一桶金", effects: { wealth: 5, intelligence: 2 }, tags: ["career"] },
  { ageMin: 23, ageMax: 30, text: "被骗了一大笔钱", effects: { wealth: -4 }, tags: ["misfortune"] },
  { ageMin: 23, ageMax: 30, text: "学会了投资理财", effects: { wealth: 2, intelligence: 1 }, tags: ["finance"] },
  { ageMin: 25, ageMax: 30, text: "孩子出生了", effects: { wealth: -2, health: -1 }, tags: ["family"] },
  { ageMin: 23, ageMax: 30, text: "出了一次车祸", effects: { health: -3, wealth: -2 }, tags: ["accident"] },

  // 中年 31-45
  { ageMin: 31, ageMax: 45, text: "事业达到巅峰", effects: { wealth: 4, intelligence: 1 }, tags: ["career"] },
  { ageMin: 31, ageMax: 45, text: "中年危机来了", effects: { health: -2, looks: -1 }, tags: ["crisis"] },
  { ageMin: 31, ageMax: 45, text: "孩子成绩很好，很欣慰", effects: { intelligence: 1, health: 1 }, tags: ["family"] },
  { ageMin: 31, ageMax: 45, text: "离婚了", effects: { wealth: -3, health: -2 }, tags: ["love"] },
  { ageMin: 31, ageMax: 45, text: "开始养生，身体好了很多", effects: { health: 3 }, tags: ["health"] },
  { ageMin: 31, ageMax: 45, text: "升为公司高管", effects: { wealth: 4, intelligence: 2 }, tags: ["career"] },
  { ageMin: 31, ageMax: 45, text: "查出慢性病，需要长期治疗", effects: { health: -3, wealth: -2 }, tags: ["illness"] },
  { ageMin: 31, ageMax: 45, text: "投资房产大赚一笔", effects: { wealth: 5 }, tags: ["finance"] },
  { ageMin: 31, ageMax: 45, text: "开始秃头了", effects: { looks: -2 }, tags: ["aging"] },

  // 中晚年 46-60
  { ageMin: 46, ageMax: 60, text: "孩子考上了好大学", effects: { intelligence: 1, wealth: -1 }, tags: ["family"] },
  { ageMin: 46, ageMax: 60, text: "退休了，开始享受生活", effects: { health: 2, wealth: -1 }, tags: ["retirement"] },
  { ageMin: 46, ageMax: 60, text: "跟老伴环游世界", effects: { health: 1, wealth: -3 }, tags: ["travel"] },
  { ageMin: 46, ageMax: 60, text: "老花眼加重了", effects: { looks: -1, health: -1 }, tags: ["aging"] },
  { ageMin: 46, ageMax: 60, text: "开始学习新技能", effects: { intelligence: 2 }, tags: ["education"] },
  { ageMin: 46, ageMax: 60, text: "身体大不如前", effects: { health: -3, looks: -1 }, tags: ["aging"] },
  { ageMin: 46, ageMax: 60, text: "儿女结婚，终于放下心", effects: { health: 1 }, tags: ["family"] },
  { ageMin: 46, ageMax: 60, text: "股票暴跌亏了养老金", effects: { wealth: -4, health: -1 }, tags: ["finance"] },

  // 晚年 61-80
  { ageMin: 61, ageMax: 80, text: "含饴弄孙，享受天伦之乐", effects: { health: 1 }, tags: ["family"] },
  { ageMin: 61, ageMax: 80, text: "住院了一段时间", effects: { health: -3, wealth: -2 }, tags: ["illness"] },
  { ageMin: 61, ageMax: 80, text: "写了一本回忆录", effects: { intelligence: 2 }, tags: ["achievement"] },
  { ageMin: 61, ageMax: 80, text: "获得了社区表彰", effects: { looks: 1, intelligence: 1 }, tags: ["social"] },
  { ageMin: 61, ageMax: 80, text: "老伴先走一步了", effects: { health: -3 }, tags: ["family"] },
  { ageMin: 61, ageMax: 80, text: "学会了用智能手机", effects: { intelligence: 1 }, tags: ["tech"] },
  { ageMin: 61, ageMax: 80, text: "每天公园太极拳", effects: { health: 2 }, tags: ["sport"] },

  // 高寿 81-100
  { ageMin: 81, ageMax: 100, text: "四世同堂，儿孙满堂", effects: { health: 1 }, tags: ["family"] },
  { ageMin: 81, ageMax: 100, text: "身体依然硬朗", effects: { health: 2 }, tags: ["health"] },
  { ageMin: 81, ageMax: 100, text: "上了电视成了网红爷爷/奶奶", effects: { looks: 2, wealth: 1 }, tags: ["fame"] },
  { ageMin: 81, ageMax: 100, text: "平静地离开了这个世界", effects: {}, tags: ["end"] },
];

function pickEvent(age, attrs) {
  const candidates = EVENTS_POOL.filter((e) => age >= e.ageMin && age <= e.ageMax);
  if (candidates.length === 0) return null;

  const weights = candidates.map((evt) => {
    let w = 1;
    Object.entries(evt.effects).forEach(([attr, val]) => {
      const cur = attrs[attr] || 5;
      if (val < 0 && cur <= 3) w += 0.3;
      if (val > 0 && cur >= 8) w -= 0.2;
    });
    return Math.max(0.1, w);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < candidates.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function applyEffects(attrs, effects) {
  const next = { ...attrs };
  Object.entries(effects).forEach(([attr, val]) => {
    next[attr] = Math.max(0, Math.min(10, (next[attr] || 5) + val));
  });
  return next;
}

function checkDeath(age, health) {
  if (age < 30) return false;
  if (health <= 0) return true;
  const baseRate = age > 80 ? 0.15 : age > 60 ? 0.03 : age > 45 ? 0.01 : 0.002;
  const healthPenalty = health < 3 ? (3 - health) * 0.04 : 0;
  return Math.random() < baseRate + healthPenalty;
}

function buildEventPrompt(age, stageName, eventText, attrs, historyEvents) {
  const recentHistory = historyEvents
    .slice(-5)
    .map((h) => `${h.age}岁：${h.text}`)
    .join("；");

  return `你是一个文笔细腻的人生故事叙述者。请用1-2句话（不超过50字）生动描述以下人生事件，要有画面感和情感。

角色属性：颜值${attrs.looks}、智力${attrs.intelligence}、体质${attrs.health}、家境${attrs.wealth}（满分10）
当前年龄：${age}岁（${stageName}阶段）
近期经历：${recentHistory || "暂无"}
本次事件：${eventText}

要求：
- 直接输出描述文字，不要加引号和前缀
- 根据属性值高低调整描述语气（属性高=积极向上，属性低=略显艰难）
- 简洁有力，有故事感`;
}

function buildSummaryPrompt(attrs, historyEvents, finalAge) {
  const timeline = historyEvents
    .map((h) => `${h.age}岁：${h.text}`)
    .join("\n");

  return `你是一位富有文学感的人生评论家。请根据以下人生经历，写一段100-150字的人生总结。

最终属性：颜值${attrs.looks}、智力${attrs.intelligence}、体质${attrs.health}、家境${attrs.wealth}
享年：${finalAge}岁

人生轨迹：
${timeline}

要求：
- 文风温暖而富有哲理
- 概括人生主线和高光/低谷时刻
- 最后给出一句有深意的人生感悟
- 直接输出总结文字，不需要标题`;
}

function calcFinalScore(attrs, age) {
  const attrScore =
    attrs.looks * 0.15 +
    attrs.intelligence * 0.25 +
    attrs.health * 0.3 +
    attrs.wealth * 0.3;
  const ageBonus = Math.min(age / 80, 1) * 2;
  return Math.min(10, Math.round((attrScore + ageBonus) * 10) / 10);
}

function getScoreLabel(score) {
  if (score >= 9) return "传奇人生";
  if (score >= 7.5) return "精彩人生";
  if (score >= 6) return "平凡幸福";
  if (score >= 4) return "坎坷但值得";
  if (score >= 2) return "艰辛一生";
  return "命途多舛";
}

module.exports = {
  ATTRIBUTES,
  ATTR_LABELS,
  AGE_STAGES,
  EVENTS_POOL,
  getStageLabel,
  pickEvent,
  applyEffects,
  checkDeath,
  buildEventPrompt,
  buildSummaryPrompt,
  calcFinalScore,
  getScoreLabel,
};
