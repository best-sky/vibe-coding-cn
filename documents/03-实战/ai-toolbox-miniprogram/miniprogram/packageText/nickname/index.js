const { streamChat } = require("../../services/ai-service");
const { recordToolUse } = require("../../utils/storage");

const STYLES = [
  "简约文艺", "古风诗意", "可爱萌系", "英文混搭",
  "搞怪幽默", "高冷御姐", "日系清新", "暗黑中二",
];

const PLATFORMS = ["微信", "微博", "抖音", "小红书", "游戏", "通用"];

Page({
  data: {
    styles: STYLES,
    platforms: PLATFORMS,
    activeStyle: STYLES[0],
    activePlatform: PLATFORMS[5],
    keyword: "",
    loading: false,
    nicknames: [],
    statusBarHeight: 44,
  },

  _aborted: false,

  onLoad() {
    recordToolUse("nickname");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value || "" });
  },

  onSelectStyle(e) {
    this.setData({ activeStyle: e.currentTarget.dataset.value });
  },

  onSelectPlatform(e) {
    this.setData({ activePlatform: e.currentTarget.dataset.value });
  },

  async onGenerate() {
    if (this.data.loading) return;

    this._aborted = false;
    this.setData({ loading: true, nicknames: [] });

    const { activeStyle, activePlatform, keyword } = this.data;
    const systemPrompt = "你是网名创意大师，擅长根据风格和平台特点生成有个性、有记忆点的网名。";
    const keywordHint = keyword.trim() ? `\n关键词/兴趣：${keyword.trim()}` : "";
    const userPrompt = `风格：${activeStyle}\n平台：${activePlatform}${keywordHint}\n\n请生成8个网名，每个网名用以下格式输出：\n网名：xxx\n灵感：xxx（一句话说明灵感来源）\n\n直接输出，不要其他内容。`;

    let raw = "";
    try {
      await streamChat(systemPrompt, userPrompt, (chunk) => {
        if (this._aborted) return;
        raw += chunk;
        this._parseNicknames(raw);
      });
      this._parseNicknames(raw);
    } catch (err) {
      if (!this._aborted) {
        wx.showToast({ title: "生成失败，请重试", icon: "none" });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  _parseNicknames(text) {
    const blocks = text.split(/(?=网名[：:])/).filter(Boolean);
    const nicknames = [];
    for (const block of blocks) {
      const nameMatch = block.match(/网名[：:]\s*(.+)/);
      const inspMatch = block.match(/灵感[：:]\s*(.+)/);
      if (nameMatch) {
        nicknames.push({
          name: nameMatch[1].trim(),
          inspiration: inspMatch ? inspMatch[1].trim() : "",
        });
      }
    }
    if (nicknames.length > 0) {
      this.setData({ nicknames });
    }
  },

  onCopyName(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;
    wx.setClipboardData({
      data: name,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },
});
