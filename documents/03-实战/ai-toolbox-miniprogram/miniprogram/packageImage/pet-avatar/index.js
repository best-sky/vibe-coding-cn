const { recordToolUse } = require("../../utils/storage");
const { PET_STYLES, PET_TYPES, buildPrompt } = require("../../services/pet-avatar-prompts");
const { generateImage } = require("../../services/ai-service");

const HISTORY_KEY = "pet_avatar_history";
const MAX_HISTORY = 5;

function loadHistory() {
  try {
    return wx.getStorageSync(HISTORY_KEY) || [];
  } catch (e) {
    return [];
  }
}

function saveHistory(item) {
  try {
    const list = loadHistory();
    list.unshift(item);
    if (list.length > MAX_HISTORY) list.length = MAX_HISTORY;
    wx.setStorageSync(HISTORY_KEY, list);
  } catch (e) {}
}

Page({
  data: {
    statusBarHeight: 44,
    canvasW: 1,
    canvasH: 1,
    styles: PET_STYLES,
    petTypes: PET_TYPES,
    selectedStyle: "",
    selectedPetType: "",
    petDesc: "",
    generating: false,
    resultImage: "",
    errorMsg: "",
  },

  onLoad() {
    recordToolUse("pet-avatar");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectPetType(e) {
    this.setData({ selectedPetType: e.currentTarget.dataset.key });
  },

  onSelectStyle(e) {
    this.setData({
      selectedStyle: e.currentTarget.dataset.key,
      resultImage: "",
      errorMsg: "",
    });
  },

  onDescInput(e) {
    this.setData({ petDesc: e.detail.value });
  },

  async onGenerate() {
    if (this.data.generating) return;
    if (!this.data.selectedStyle) {
      wx.showToast({ title: "请选择一种风格", icon: "none" });
      return;
    }
    if (!this.data.selectedPetType && !this.data.petDesc) {
      wx.showToast({ title: "请选择宠物类型或填写描述", icon: "none" });
      return;
    }

    this.setData({ generating: true, resultImage: "", errorMsg: "" });

    try {
      const prompt = buildPrompt(
        this.data.selectedStyle,
        this.data.selectedPetType,
        this.data.petDesc
      );
      const result = await generateImage(prompt, { size: "1024x1024" });

      if (!result) {
        this.setData({ generating: false, errorMsg: "生成失败：未收到返回结果" });
        return;
      }

      if (result.error) {
        this.setData({ generating: false, errorMsg: "生成失败：" + result.error });
        return;
      }

      const imgUrl = (result.data && result.data[0] && result.data[0].url) || result.url || result.imageUrl;
      if (imgUrl) {
        this.setData({ resultImage: imgUrl, generating: false });
        saveHistory({
          style: this.data.selectedStyle,
          petType: this.data.selectedPetType,
          resultUrl: imgUrl,
          time: Date.now(),
        });
      } else {
        this.setData({
          generating: false,
          errorMsg: "生成失败：未获取到图片地址",
        });
        console.warn("generateImage result:", JSON.stringify(result));
      }
    } catch (err) {
      const msg = err.message || "";
      let errorMsg = "生成失败，请检查网络后重试";
      if (msg.includes("云开发未初始化") || msg.includes("AI")) {
        errorMsg = "云开发 AI 服务未就绪，请确认已开通";
      } else if (msg) {
        errorMsg = "生成失败：" + msg;
      }
      this.setData({ generating: false, errorMsg });
    }
  },

  _saveToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => wx.showToast({ title: "已保存到相册", icon: "success" }),
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes("auth deny")) {
          wx.showModal({
            title: "需要相册权限",
            content: "请在设置中允许保存图片到相册",
            confirmText: "去设置",
            success: (modalRes) => {
              if (modalRes.confirm) wx.openSetting();
            },
          });
        } else {
          wx.showToast({ title: "保存失败", icon: "none" });
        }
      },
    });
  },

  onSaveImage() {
    if (!this.data.resultImage) return;
    const imgUrl = this.data.resultImage;

    wx.showLoading({ title: "保存中…" });

    if (!imgUrl.startsWith("http") || imgUrl.startsWith("http://tmp/")) {
      wx.hideLoading();
      this._saveToAlbum(imgUrl);
      return;
    }

    const query = this.createSelectorQuery();
    query.select("#saveCanvas").fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        wx.hideLoading();
        wx.showToast({ title: "保存失败", icon: "none" });
        return;
      }
      const canvas = res[0].node;
      const img = canvas.createImage();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        this.setData({ canvasW: img.width, canvasH: img.height });
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        wx.canvasToTempFilePath({
          canvas,
          success: (tmpRes) => {
            wx.hideLoading();
            this._saveToAlbum(tmpRes.tempFilePath);
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: "保存失败", icon: "none" });
          },
        });
      };
      img.onerror = () => {
        wx.hideLoading();
        wx.showToast({ title: "图片加载失败", icon: "none" });
      };
      img.src = imgUrl;
    });
  },

  onRegenerate() {
    this.onGenerate();
  },
});
