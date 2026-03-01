const { streamChat } = require("../../services/ai-service");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

Page({
  data: {
    prompt: "",
    selectedType: "小红书种草",
    chips: ["小红书种草", "朋友圈短文", "广告语", "自定义"],
    result: "",
    generating: false,
    statusBarHeight: 44,
  },

  onLoad() {
    recordToolUse("copywriting");
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
    this.setData({ prompt: e.detail.value || "" });
  },

  onSelectType(e) {
    this.setData({ selectedType: e.currentTarget.dataset.value });
  },

  buildPrompt() {
    const { selectedType, prompt } = this.data;
    return `请生成${selectedType}文案。主题与要求：${prompt}。输出3条，风格不同，口语化且可直接发布。`;
  },

  onGenerate() {
    if (!this.data.prompt.trim()) {
      wx.showToast({ title: "请先输入主题", icon: "none" });
      return;
    }

    showRewardedVideo(async () => {
      this.setData({ generating: true, result: "" });
      try {
        await streamChat("你是资深中文营销文案专家。", this.buildPrompt(), (chunk) => {
          this.setData({ result: `${this.data.result}${chunk}` });
        });
      } catch (err) {
        wx.showToast({ title: "AI 生成失败", icon: "none" });
      } finally {
        this.setData({ generating: false });
      }
    });
  },

  onCopy() {
    if (!this.data.result) return;
    wx.setClipboardData({
      data: this.data.result,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },
});
