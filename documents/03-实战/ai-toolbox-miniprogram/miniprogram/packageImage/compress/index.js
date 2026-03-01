const { chooseSingleImage, getImageInfo, canvasToTempFilePath, saveImageToAlbum } = require("../../utils/canvas-helper");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

const QUALITY_MAP = {
  high: 0.8,
  mid: 0.5,
  low: 0.2,
};

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
  },

  onLoad() {
    recordToolUse("compress");
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
      const ctx = wx.createCanvasContext("compressCanvas", this);
      ctx.drawImage(sourcePath, 0, 0, info.width, info.height);
      await new Promise((resolve) => ctx.draw(false, resolve));

      const out = await canvasToTempFilePath({
        canvasId: "compressCanvas",
        fileType: "jpg",
        quality,
        width: info.width,
        height: info.height,
        destWidth: info.width,
        destHeight: info.height,
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
        wx.showToast({ title: "未完成广告，仍允许保存", icon: "none" });
      }
    );
  },
});
