const { chooseSingleImage, getImageInfo, canvasToTempFilePath, saveImageToAlbum } = require("../../utils/canvas-helper");
const { showRewardedVideo, createBanner } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

const MAX_OUTPUT_SIDE = 2048;
const COLOR_PRESETS = ["#171717", "#FFFFFF", "#2563EB", "#DC2626", "#16A34A"];

function calcOutputSize(width, height) {
  if (!width || !height) {
    return { width: 1080, height: 1080 };
  }
  const maxSide = Math.max(width, height);
  if (maxSide <= MAX_OUTPUT_SIDE) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  const scale = MAX_OUTPUT_SIDE / maxSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

Page({
  data: {
    statusBarHeight: 44,
    sourcePath: "",
    previewPath: "",
    outputPath: "",
    watermarkText: "智藏",
    fontSize: 36,
    opacity: 0.3,
    opacityPercent: 30,
    rotation: -30,
    mode: "tile",
    color: "#171717",
    colorPresets: COLOR_PRESETS,
    processing: false,
    canvasWidth: 1080,
    canvasHeight: 1080,
  },

  onLoad() {
    recordToolUse("watermark");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
    this.bannerAd = createBanner();
  },

  onUnload() {
    if (this.bannerAd && this.bannerAd.destroy) {
      this.bannerAd.destroy();
    }
  },

  onBack() {
    wx.navigateBack();
  },

  async onChooseImage() {
    try {
      const file = await chooseSingleImage();
      this.setData({
        sourcePath: file.tempFilePath,
        previewPath: file.tempFilePath,
      });
      await this.renderWatermark();
    } catch (error) {
      wx.showToast({ title: "选择图片失败", icon: "none" });
    }
  },

  onInputText(e) {
    this.setData({ watermarkText: e.detail.value || "" });
    this.tryRender();
  },

  onFontSizeChange(e) {
    this.setData({ fontSize: Number(e.detail.value || 14) });
    this.tryRender();
  },

  onOpacityChange(e) {
    const opacityPercent = Number(e.detail.value || 10);
    this.setData({
      opacityPercent,
      opacity: opacityPercent / 100,
    });
    this.tryRender();
  },

  onRotationChange(e) {
    this.setData({ rotation: Number(e.detail.value || 0) });
    this.tryRender();
  },

  onSelectMode(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
    this.tryRender();
  },

  onSelectColor(e) {
    this.setData({ color: e.currentTarget.dataset.color });
    this.tryRender();
  },

  tryRender() {
    if (!this.data.sourcePath) return;
    this.renderWatermark();
  },

  async renderWatermark() {
    if (!this.data.sourcePath) return;
    const text = (this.data.watermarkText || "").trim();
    if (!text) {
      wx.showToast({ title: "请输入水印文字", icon: "none" });
      return;
    }
    this.setData({ processing: true });
    try {
      const info = await getImageInfo(this.data.sourcePath);
      const size = calcOutputSize(info.width, info.height);
      this.setData({
        canvasWidth: size.width,
        canvasHeight: size.height,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      const ctx = wx.createCanvasContext("watermarkCanvas", this);
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.drawImage(this.data.sourcePath, 0, 0, size.width, size.height);
      ctx.save();
      ctx.setFillStyle(this.data.color);
      ctx.setGlobalAlpha(this.data.opacity);
      ctx.setFontSize(this.data.fontSize);
      this.drawWatermarkText(ctx, size.width, size.height, text);
      ctx.restore();
      await new Promise((resolve) => ctx.draw(false, resolve));

      const output = await canvasToTempFilePath({
        canvasId: "watermarkCanvas",
        fileType: "jpg",
        quality: 0.92,
        width: size.width,
        height: size.height,
        destWidth: size.width,
        destHeight: size.height,
      });
      this.setData({
        outputPath: output.tempFilePath,
        previewPath: output.tempFilePath,
      });
    } catch (error) {
      wx.showToast({ title: "添加水印失败", icon: "none" });
    } finally {
      this.setData({ processing: false });
    }
  },

  drawWatermarkText(ctx, width, height, text) {
    const rad = (this.data.rotation * Math.PI) / 180;
    if (this.data.mode === "single") {
      const textWidth = Math.max(this.data.fontSize, this.data.fontSize * text.length);
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rad);
      ctx.fillText(text, -textWidth / 2, 0);
      return;
    }

    const xStep = Math.max(this.data.fontSize * 4, this.data.fontSize * (text.length + 2));
    const yStep = Math.max(this.data.fontSize * 3, this.data.fontSize * 2.8);
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rad);
    for (let y = -height; y < height; y += yStep) {
      for (let x = -width; x < width; x += xStep) {
        ctx.fillText(text, x, y);
      }
    }
  },

  onSave() {
    if (!this.data.outputPath) {
      wx.showToast({ title: "请先添加水印", icon: "none" });
      return;
    }
    showRewardedVideo(
      async () => {
        try {
          await saveImageToAlbum(this.data.outputPath);
          wx.showToast({ title: "已保存到相册", icon: "success" });
        } catch (error) {
          wx.showToast({ title: "保存失败", icon: "none" });
        }
      },
      () => {
        wx.showToast({ title: "未完整观看广告，无法保存", icon: "none" });
      }
    );
  },
});
