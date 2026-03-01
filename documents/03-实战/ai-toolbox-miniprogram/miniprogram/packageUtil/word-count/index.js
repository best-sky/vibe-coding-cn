const { recordToolUse } = require("../../utils/storage");

function computeStats(text) {
  const safeText = text || "";
  const chars = safeText.length;
  const words = (safeText.replace(/\s/g, "").match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g) || []).length;
  const lines = safeText ? safeText.split(/\r?\n/).length : 0;
  const paragraphs = safeText
    ? safeText
        .split(/\r?\n/)
        .map((row) => row.trim())
        .filter(Boolean).length
    : 0;
  return { words, chars, lines, paragraphs };
}

Page({
  data: {
    text: "",
    stats: {
      words: 0,
      chars: 0,
      lines: 0,
      paragraphs: 0,
    },
    statusBarHeight: 44,
  },

  onLoad() {
    recordToolUse("word-count");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight
      });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    const text = e.detail.value || "";
    this.setData({
      text,
      stats: computeStats(text),
    });
  },

  onClear() {
    this.setData({
      text: "",
      stats: computeStats(""),
    });
  },
});
