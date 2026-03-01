const { TOOL_LIST } = require("../../utils/constants");
const { getRecentTools, getUsageMap } = require("../../utils/storage");
const { showInterstitial } = require("../../utils/ad-manager");

Page({
  data: {
    profileName: "智藏用户",
    profileDesc: "让每个灵感都快速落地",
    totalUseCount: 0,
    recentTools: [],
  },

  onShow() {
    const usageMap = getUsageMap();
    const totalUseCount = Object.keys(usageMap).reduce((sum, key) => sum + (usageMap[key] || 0), 0);
    const recentIds = getRecentTools();
    const recentTools = recentIds
      .map((id) => TOOL_LIST.find((tool) => tool.id === id))
      .filter(Boolean);

    this.setData({
      totalUseCount,
      recentTools,
    });
  },

  onTapItem(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "record") {
      wx.showToast({ title: "使用记录已在下方展示", icon: "none" });
      return;
    }
    if (type === "about") {
      wx.showModal({
        title: "关于智藏",
        content: "智藏是一款 AI 图片 + 文字工具箱小程序。",
        showCancel: false,
      });
      return;
    }
    if (type === "feedback") {
      wx.showToast({ title: "可通过小程序意见反馈入口提交", icon: "none" });
    }
  },

  onGoTool(e) {
    const path = e.currentTarget.dataset.path;
    if (!path) return;
    showInterstitial();
    wx.navigateTo({ url: path });
  },
});
