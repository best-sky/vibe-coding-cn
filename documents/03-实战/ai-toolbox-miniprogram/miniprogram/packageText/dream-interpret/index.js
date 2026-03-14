const { agentChat, streamChat } = require("../../services/ai-service");
const { recordToolUse } = require("../../utils/storage");
const { AGENT_IDS } = require("../../utils/constants");

const STYLES = ["周公解梦", "心理分析", "趣味解读"];

Page({
  data: {
    styles: STYLES,
    activeStyle: STYLES[0],
    dreamContent: "",
    loading: false,
    resultText: "",
    isGenerating: false,
    statusBarHeight: 44,
  },

  _aborted: false,

  onLoad() {
    recordToolUse("dream-interpret");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ dreamContent: e.detail.value || "" });
  },

  onSelectStyle(e) {
    this.setData({ activeStyle: e.currentTarget.dataset.value });
  },

  async onGenerate() {
    if (this.data.loading) return;

    const dreamContent = this.data.dreamContent.trim();
    if (!dreamContent) {
      wx.showToast({ title: "请先输入梦境内容", icon: "none" });
      return;
    }

    this._aborted = false;
    this.setData({ loading: true, resultText: "", isGenerating: true });

    const style = this.data.activeStyle;
    const systemPrompt = this._buildSystemPrompt(style);
    const userPrompt = `我的梦境内容：${dreamContent}\n\n请以「${style}」的角度为我解读这个梦。`;

    let raw = "";
    const handleChunk = (chunk) => {
      if (this._aborted) return;
      raw += chunk;
      this.setData({ resultText: raw });
    };

    try {
      const agentId = AGENT_IDS["dream-interpret"];
      if (agentId && !agentId.includes("xxx")) {
        await agentChat(agentId, userPrompt, handleChunk);
      } else {
        await streamChat(systemPrompt, userPrompt, handleChunk);
      }
    } catch (err) {
      if (this._aborted) return;
      if (raw) return;
      try {
        await streamChat(systemPrompt, userPrompt, handleChunk);
      } catch (fallbackErr) {
        wx.showToast({ title: "解梦失败，请重试", icon: "none" });
      }
    } finally {
      this.setData({ loading: false, isGenerating: false });
    }
  },

  _buildSystemPrompt(style) {
    const styleMap = {
      "周公解梦": "你是一位精通周公解梦的中国传统解梦师，善于从古典文化角度分析梦境的象征含义。请以温和亲切的语气，从传统文化和民俗角度为用户解读梦境，给出吉凶判断和寓意。格式要清晰，分「梦境要素」「传统寓意」「综合解读」「温馨提示」四部分输出。",
      "心理分析": "你是一位专业的心理学梦境分析师，精通弗洛伊德和荣格的梦境分析理论。请从潜意识、情绪映射、内心需求等心理学角度为用户解析梦境。格式分「梦境要素」「心理映射」「深层解读」「建议」四部分输出。",
      "趣味解读": "你是一位幽默风趣的解梦达人，善于用轻松搞笑的方式解读梦境。请用诙谐幽默但不失道理的方式为用户解梦，可以适当加入 emoji 和网络梗，让用户开心之余也能有所启发。格式自由发挥，但要有趣味性。",
    };
    return styleMap[style] || styleMap["周公解梦"];
  },

  onCopyResult() {
    const text = this.data.resultText;
    if (!text) return;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },

  onShareAppMessage() {
    return {
      title: "AI 解梦 — 输入梦境，AI 为你解读",
      path: "/packageText/dream-interpret/index",
    };
  },
});
