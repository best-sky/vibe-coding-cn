const { chooseSingleImage, getImageInfo, canvasToTempFilePath, saveImageToAlbum } = require("../../utils/canvas-helper");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

const QUALITY_MAP = {
  high: 0.8,
  mid: 0.5,
  low: 0.2,
};
const MAX_OUTPUT_SIDE = 2048;

function getFileSizeKb(path) {
  try {
    const stat = wx.getFileSystemManager().statSync(path);
    return Number((stat.size / 1024).toFixed(1));
  } catch (e) {
    return 0;
  }
}

Page({
  data: {
    sourcePath: "",
    compressedPath: "",
    selectedQuality: "high",
    sourceSizeKb: 0,
    compressedSizeKb: 0,
    previewPath: "",
    processing: false,
    statusBarHeight: 44,
    canvasWidth: 750,
    canvasHeight: 750,
  },

  onLoad() {
    recordToolUse("compress");
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

  onSelectQuality(e) {
    this.setData({
      selectedQuality: e.currentTarget.dataset.key,
    });
    if (this.data.sourcePath) {
      this.compressCurrentImage();
    }
  },

  async onChooseImage() {
    try {
      const file = await chooseSingleImage();
      const sizeKb = Number((file.size / 1024).toFixed(1));
      this.setData({
        sourcePath: file.tempFilePath,
        sourceSizeKb: sizeKb,
        previewPath: file.tempFilePath,
      });
      this.compressCurrentImage();
    } catch (err) {
      wx.showToast({ title: "选择图片失败", icon: "none" });
    }
  },

  async compressCurrentImage() {
    const { sourcePath, selectedQuality } = this.data;
    if (!sourcePath) return;
    this.setData({ processing: true });
    try {
      const info = await getImageInfo(sourcePath);
      const quality = QUALITY_MAP[selectedQuality];
      const { width: drawWidth, height: drawHeight } = this.calcOutputSize(info.width, info.height);
      this.setData({
        canvasWidth: drawWidth,
        canvasHeight: drawHeight,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      const ctx = wx.createCanvasContext("compressCanvas", this);
      ctx.clearRect(0, 0, drawWidth, drawHeight);
      ctx.drawImage(sourcePath, 0, 0, drawWidth, drawHeight);
      await new Promise((resolve) => ctx.draw(false, resolve));

      const out = await canvasToTempFilePath({
        canvasId: "compressCanvas",
        fileType: "jpg",
        quality,
        width: drawWidth,
        height: drawHeight,
        destWidth: drawWidth,
        destHeight: drawHeight,
      });
      this.setData({
        compressedPath: out.tempFilePath,
        previewPath: out.tempFilePath,
        compressedSizeKb: getFileSizeKb(out.tempFilePath),
      });
    } catch (err) {
      wx.showToast({ title: "压缩失败", icon: "none" });
    } finally {
      this.setData({ processing: false });
    }
  },

  onSave() {
    if (!this.data.compressedPath) {
      wx.showToast({ title: "请先选择图片", icon: "none" });
      return;
    }
    showRewardedVideo(
      async () => {
        try {
          await saveImageToAlbum(this.data.compressedPath);
          wx.showToast({ title: "已保存到相册", icon: "success" });
        } catch (err) {
          wx.showToast({ title: "保存失败", icon: "none" });
        }
      },
      () => {
        wx.showToast({ title: "未完整观看广告，图片未保存", icon: "none" });
      }
    );
  },

  calcOutputSize(width, height) {
    if (!width || !height) {
      return { width: 750, height: 750 };
    }
    const longestSide = Math.max(width, height);
    if (longestSide <= MAX_OUTPUT_SIDE) {
      return {
        width: Math.round(width),
        height: Math.round(height),
      };
    }
    const scale = MAX_OUTPUT_SIDE / longestSide;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  },
});
