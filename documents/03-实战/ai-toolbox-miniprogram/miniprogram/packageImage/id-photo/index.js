const { BG_COLORS, ID_PHOTO_SIZES } = require("../../utils/constants");
const { chooseSingleImage, saveImageToAlbum } = require("../../utils/canvas-helper");
const { replaceBackground, calcCropRect } = require("../../utils/image-processor");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

Page({
  data: {
    colors: BG_COLORS,
    sizes: ID_PHOTO_SIZES,
    activeColor: "white",
    activeSize: "one",
    sourcePath: "",
    previewPath: "",
    outputPath: "",
    processing: false,
    statusBarHeight: 44,
  },

  onLoad() {
    recordToolUse("id-photo");
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

  onSelectColor(e) {
    this.setData({ activeColor: e.currentTarget.dataset.key });
    if (this.data.sourcePath) this.processPhoto();
  },

  onSelectSize(e) {
    this.setData({ activeSize: e.currentTarget.dataset.key });
    if (this.data.sourcePath) this.processPhoto();
  },

  async onChooseImage() {
    try {
      const file = await chooseSingleImage();
      this.setData({
        sourcePath: file.tempFilePath,
        previewPath: file.tempFilePath,
      });
      this.processPhoto();
    } catch (err) {
      wx.showToast({ title: "选择图片失败", icon: "none" });
    }
  },

  getActiveColorValue() {
    const color = this.data.colors.find((item) => item.key === this.data.activeColor);
    return color ? color.color : "#FFFFFF";
  },

  getActiveSize() {
    return this.data.sizes.find((item) => item.key === this.data.activeSize) || this.data.sizes[0];
  },

  async processPhoto() {
    if (!this.data.sourcePath) return;
    this.setData({ processing: true });
    try {
      const query = wx.createSelectorQuery().in(this);
      const canvasRes = await new Promise((resolve, reject) => {
        query
          .select("#idPhotoCanvas")
          .fields({ node: true, size: true })
          .exec((res) => {
            if (!res || !res[0] || !res[0].node) {
              reject(new Error("Canvas 初始化失败"));
              return;
            }
            resolve(res[0]);
          });
      });

      const canvas = canvasRes.node;
      const ctx = canvas.getContext("2d");
      const dpr = wx.getWindowInfo().pixelRatio || 2;
      const width = Math.floor(canvasRes.width);
      const height = Math.floor(canvasRes.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const img = canvas.createImage();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = this.data.sourcePath;
      });

      const crop = calcCropRect(img.width, img.height, this.getActiveSize());
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);

      const data = ctx.getImageData(0, 0, width, height);
      const nextData = replaceBackground(data, this.getActiveColorValue());
      ctx.putImageData(nextData, 0, 0);

      const out = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath(
          {
            canvas: canvas,
            fileType: "jpg",
            quality: 0.92,
            width,
            height,
            destWidth: width,
            destHeight: height,
            success: resolve,
            fail: reject,
          },
          this
        );
      });
      this.setData({
        outputPath: out.tempFilePath,
        previewPath: out.tempFilePath,
      });
    } catch (err) {
      wx.showToast({ title: "处理失败", icon: "none" });
    } finally {
      this.setData({ processing: false });
    }
  },

  onSave() {
    if (!this.data.outputPath) {
      wx.showToast({ title: "请先选择图片", icon: "none" });
      return;
    }
    showRewardedVideo(async () => {
      try {
        await saveImageToAlbum(this.data.outputPath);
        wx.showToast({ title: "已保存到相册", icon: "success" });
      } catch (err) {
        wx.showToast({ title: "保存失败", icon: "none" });
      }
    });
  },
});
