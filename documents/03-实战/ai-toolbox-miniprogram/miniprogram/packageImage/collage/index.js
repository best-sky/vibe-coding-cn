const { getImageInfo, canvasToTempFilePath, saveImageToAlbum } = require("../../utils/canvas-helper");
const { showRewardedVideo, createBanner } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

const OUTPUT_SIZE = 1200;
const TEMPLATES = [
  {
    key: "2h",
    label: "2格横",
    count: 2,
    layout: [
      [0, 0, 0.5, 1],
      [0.5, 0, 0.5, 1],
    ],
  },
  {
    key: "2v",
    label: "2格竖",
    count: 2,
    layout: [
      [0, 0, 1, 0.5],
      [0, 0.5, 1, 0.5],
    ],
  },
  {
    key: "4",
    label: "4宫格",
    count: 4,
    layout: [
      [0, 0, 0.5, 0.5],
      [0.5, 0, 0.5, 0.5],
      [0, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
    ],
  },
  {
    key: "6",
    label: "6宫格",
    count: 6,
    layout: [
      [0, 0, 1 / 3, 0.5],
      [1 / 3, 0, 1 / 3, 0.5],
      [2 / 3, 0, 1 / 3, 0.5],
      [0, 0.5, 1 / 3, 0.5],
      [1 / 3, 0.5, 1 / 3, 0.5],
      [2 / 3, 0.5, 1 / 3, 0.5],
    ],
  },
  {
    key: "9",
    label: "9宫格",
    count: 9,
    layout: [
      [0, 0, 1 / 3, 1 / 3],
      [1 / 3, 0, 1 / 3, 1 / 3],
      [2 / 3, 0, 1 / 3, 1 / 3],
      [0, 1 / 3, 1 / 3, 1 / 3],
      [1 / 3, 1 / 3, 1 / 3, 1 / 3],
      [2 / 3, 1 / 3, 1 / 3, 1 / 3],
      [0, 2 / 3, 1 / 3, 1 / 3],
      [1 / 3, 2 / 3, 1 / 3, 1 / 3],
      [2 / 3, 2 / 3, 1 / 3, 1 / 3],
    ],
  },
];

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function calcCoverCrop(imageWidth, imageHeight, targetWidth, targetHeight) {
  const sourceRatio = imageWidth / imageHeight;
  const targetRatio = targetWidth / targetHeight;
  if (sourceRatio > targetRatio) {
    const cropWidth = imageHeight * targetRatio;
    return {
      sx: (imageWidth - cropWidth) / 2,
      sy: 0,
      sw: cropWidth,
      sh: imageHeight,
    };
  }
  const cropHeight = imageWidth / targetRatio;
  return {
    sx: 0,
    sy: (imageHeight - cropHeight) / 2,
    sw: imageWidth,
    sh: cropHeight,
  };
}

Page({
  data: {
    statusBarHeight: 44,
    templates: TEMPLATES,
    activeTemplate: TEMPLATES[0].key,
    sourceImages: [],
    previewPath: "",
    outputPath: "",
    gap: 10,
    radius: 24,
    processing: false,
    canvasWidth: OUTPUT_SIZE,
    canvasHeight: OUTPUT_SIZE,
  },

  onLoad() {
    recordToolUse("collage");
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

  getActiveTemplate() {
    return this.data.templates.find((item) => item.key === this.data.activeTemplate) || this.data.templates[0];
  },

  onSelectTemplate(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      activeTemplate: key,
      sourceImages: [],
      previewPath: "",
      outputPath: "",
    });
  },

  onGapChange(e) {
    this.setData({ gap: Number(e.detail.value || 0) });
    if (this.data.sourceImages.length) {
      this.renderCollage();
    }
  },

  onRadiusChange(e) {
    this.setData({ radius: Number(e.detail.value || 0) });
    if (this.data.sourceImages.length) {
      this.renderCollage();
    }
  },

  onChooseImages() {
    const tmpl = this.getActiveTemplate();
    wx.chooseMedia({
      count: tmpl.count,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const files = (res.tempFiles || []).map((item) => item.tempFilePath);
        if (files.length !== tmpl.count) {
          wx.showToast({
            title: `请一次选择${tmpl.count}张图片`,
            icon: "none",
          });
          return;
        }
        this.setData({ sourceImages: files }, () => this.renderCollage());
      },
      fail: () => {
        wx.showToast({ title: "选择图片失败", icon: "none" });
      },
    });
  },

  async renderCollage() {
    const template = this.getActiveTemplate();
    if (this.data.sourceImages.length !== template.count) {
      return;
    }
    this.setData({ processing: true });
    try {
      const infos = await Promise.all(this.data.sourceImages.map((path) => getImageInfo(path)));
      const size = OUTPUT_SIZE;
      const { gap, radius } = this.data;
      const ctx = wx.createCanvasContext("collageCanvas", this);
      ctx.setFillStyle("#FFFFFF");
      ctx.fillRect(0, 0, size, size);

      template.layout.forEach((slot, index) => {
        const [fx, fy, fw, fh] = slot;
        const x = fx * size + gap / 2;
        const y = fy * size + gap / 2;
        const w = fw * size - gap;
        const h = fh * size - gap;
        const info = infos[index];
        const crop = calcCoverCrop(info.width, info.height, w, h);

        ctx.save();
        drawRoundedRectPath(ctx, x, y, w, h, radius);
        ctx.clip();
        ctx.drawImage(
          this.data.sourceImages[index],
          crop.sx,
          crop.sy,
          crop.sw,
          crop.sh,
          x,
          y,
          w,
          h
        );
        ctx.restore();
      });

      await new Promise((resolve) => ctx.draw(false, resolve));
      const output = await canvasToTempFilePath({
        canvasId: "collageCanvas",
        fileType: "jpg",
        quality: 0.92,
        width: size,
        height: size,
        destWidth: size,
        destHeight: size,
      });
      this.setData({
        outputPath: output.tempFilePath,
        previewPath: output.tempFilePath,
      });
    } catch (error) {
      wx.showToast({ title: "拼图失败", icon: "none" });
    } finally {
      this.setData({ processing: false });
    }
  },

  onSave() {
    if (!this.data.outputPath) {
      wx.showToast({ title: "请先生成拼图", icon: "none" });
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
