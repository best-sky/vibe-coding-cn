const { TOOL_LIST } = require("../../utils/constants");
const { getRecentTools, getUsageMap } = require("../../utils/storage");
const { showInterstitial } = require("../../utils/ad-manager");

const STORAGE_KEY_AVATAR = "user_avatar_url";
const STORAGE_KEY_NICK = "user_nick_name";

Page({
  data: {
    nickName: "智藏用户",
    avatarUrl: "",
    profileDesc: "让每个灵感都快速落地",
    totalUseCount: 0,
    recentTools: [],
    statusBarHeight: 44,
    showNickInput: false,
  },

  onLoad() {
    const app = getApp();
    if (app && app.globalData) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
      });
    }
    this.loadProfile();
  },

  onShow() {
    const usageMap = getUsageMap();
    const totalUseCount = Object.keys(usageMap).reduce(
      (sum, key) => sum + (usageMap[key] || 0),
      0
    );
    const recentIds = getRecentTools();
    const recentTools = recentIds
      .map((id) => TOOL_LIST.find((tool) => tool.id === id))
      .filter(Boolean);

    this.setData({ totalUseCount, recentTools });
  },

  loadProfile() {
    const avatarUrl = wx.getStorageSync(STORAGE_KEY_AVATAR) || "";
    const nickName = wx.getStorageSync(STORAGE_KEY_NICK) || "智藏用户";
    this.setData({ avatarUrl, nickName });
  },

  onGotAvatar(e) {
    const { avatarUrl } = e.detail;
    if (!avatarUrl) return;
    if (this._choosingAvatar) return;
    this._choosingAvatar = true;

    const saveAndUpdate = (filePath) => {
      wx.setStorageSync(STORAGE_KEY_AVATAR, filePath);
      this.setData({ avatarUrl: filePath, showNickInput: true });
      this._choosingAvatar = false;
    };

    const fs = wx.getFileSystemManager();
    try {
      fs.accessSync(avatarUrl);
      saveAndUpdate(avatarUrl);
    } catch (_err) {
      // 模拟器可能返回无效临时路径，降级用 chooseMedia
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: (mediaRes) => {
          saveAndUpdate(mediaRes.tempFiles[0].tempFilePath);
        },
        fail: () => {
          this._choosingAvatar = false;
          wx.showToast({ title: "请在真机上体验头像功能", icon: "none" });
        },
      });
    }
  },

  onGotAvatarTap() {
    wx.showActionSheet({
      itemList: ["更换头像", "修改昵称"],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sourceType: ["album", "camera"],
            success: (mediaRes) => {
              const tempFilePath = mediaRes.tempFiles[0].tempFilePath;
              wx.setStorageSync(STORAGE_KEY_AVATAR, tempFilePath);
              this.setData({ avatarUrl: tempFilePath });
            },
          });
        } else if (res.tapIndex === 1) {
          this.setData({ showNickInput: true });
        }
      },
    });
  },

  onNameTap() {
    if (this.data.avatarUrl) {
      this.setData({ showNickInput: true });
    }
  },

  onNickNameChange(e) {
    const val = (e.detail.value || "").trim();
    if (val) {
      wx.setStorageSync(STORAGE_KEY_NICK, val);
      this.setData({ nickName: val, showNickInput: false });
    }
  },

  onNickNameBlur(e) {
    const val = (e.detail.value || "").trim();
    if (val) {
      wx.setStorageSync(STORAGE_KEY_NICK, val);
      this.setData({ nickName: val });
    }
    this.setData({ showNickInput: false });
  },

  onTapItem(e) {
    const { type } = e.currentTarget.dataset;
    if (type === "about") {
      wx.showModal({
        title: "关于智藏",
        content: "智藏是一款 AI 图片 + 文字工具箱小程序。",
        showCancel: false,
      });
      return;
    }
    if (type === "feedback") {
      wx.showToast({
        title: "可通过小程序意见反馈入口提交",
        icon: "none",
      });
    }
  },

  onGoTool(e) {
    const path = e.currentTarget.dataset.path;
    if (!path) return;
    showInterstitial();
    wx.navigateTo({ url: path });
  },
});
