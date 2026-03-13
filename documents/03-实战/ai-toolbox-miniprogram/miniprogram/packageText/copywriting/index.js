const { agentChat, streamChat } = require("../../services/ai-service");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");
const { AGENT_IDS } = require("../../utils/constants");

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
    if (this.data.generating) return;

    if (!this.data.prompt.trim()) {
      wx.showToast({ title: "请先输入主题", icon: "none" });
      return;
    }

    showRewardedVideo(async () => {
      this.setData({ generating: true, result: "" });
      const handleChunk = (chunk) => {
        this.setData({ result: `${this.data.result}${chunk}` });
      };
      try {
        if (AGENT_IDS.copywriting && !AGENT_IDS.copywriting.includes("xxx")) {
          await agentChat(AGENT_IDS.copywriting, this.buildPrompt(), handleChunk);
        } else {
          await streamChat("你是资深中文营销文案专家。", this.buildPrompt(), handleChunk);
        }
      } catch (err) {
        if (this.data.result) return;
        try {
          this.setData({ result: "" });
          await streamChat("你是资深中文营销文案专家。", this.buildPrompt(), handleChunk);
        } catch (fallbackErr) {
          wx.showToast({ title: "AI 生成失败", icon: "none" });
        }
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
