const { streamChat } = require("../../services/ai-service");
const {
  ATTRIBUTES,
  ATTR_LABELS,
  buildSummaryPrompt,
  calcFinalScore,
  getScoreLabel,
} = require("../../utils/life-events");

Page({
  data: {
    statusBarHeight: 44,
    attrs: {},
    attrLabels: ATTR_LABELS,
    attrKeys: ATTRIBUTES,
    events: [],
    finalAge: 0,
    finalScore: 0,
    scoreLabel: "",
    summaryText: "",
    isGenerating: false,
  },

  onLoad() {
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }

    const lifeData = app.globalData._lifeSimulatorData;
    if (!lifeData) {
      wx.navigateBack();
      return;
    }

    const { attrs, events, age } = lifeData;
    const score = calcFinalScore(attrs, age);
    const label = getScoreLabel(score);

    this.setData({
      attrs,
      events,
      finalAge: age,
      finalScore: score,
      scoreLabel: label,
    });

    if (lifeData.cachedSummary) {
      this.setData({ summaryText: lifeData.cachedSummary });
    } else {
      this._generateSummary(attrs, events, age, score, label);
    }
  },

  async _generateSummary(attrs, events, age, score, label) {
    this.setData({ isGenerating: true, summaryText: "" });
    const prompt = buildSummaryPrompt(attrs, events, age);
    let summary = "";

    try {
      await streamChat("你是一位人生评论家。", prompt, (chunk) => {
        summary += chunk;
        this.setData({ summaryText: summary });
      });
    } catch (err) {
      console.warn("AI summary failed:", err);
      summary = `享年${age}岁，人生评分${score}分——${label}。`;
      this.setData({ summaryText: summary });
    }

    this.setData({ isGenerating: false });

    const app = getApp();
    if (app.globalData._lifeSimulatorData) {
      app.globalData._lifeSimulatorData.cachedSummary = summary;
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onRestart() {
    const app = getApp();
    app.globalData._lifeSimulatorData = null;
    wx.navigateBack();
  },

  onShareAppMessage() {
    const { finalScore, scoreLabel, finalAge } = this.data;
    return {
      title: `我的模拟人生：${scoreLabel}（${finalScore}分），享年${finalAge}岁`,
      path: "/packageText/life-simulator/index",
    };
  },
});
