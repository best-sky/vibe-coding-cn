const { showRewardedVideo, createBanner } = require("../../utils/ad-manager");
const { saveImageToAlbum } = require("../../utils/canvas-helper");
const { recordToolUse } = require("../../utils/storage");
const { generateQrMatrix } = require("../../utils/qrcode-generator");

const SIZE_OPTIONS = [200, 400, 600, 800];
const FG_COLORS = ["#171717", "#2563EB", "#16A34A", "#DC2626", "#7C3AED", "#0F766E"];
const BG_COLORS = ["#FFFFFF", "#F5F5F5", "transparent"];
const PREVIEW_CANVAS_SIZE = 560;

Page({
  data: {
    statusBarHeight: 44,
    content: "",
    sizeOptions: SIZE_OPTIONS,
    activeSizeIndex: 1,
    fgColors: FG_COLORS,
    activeFg: FG_COLORS[0],
    bgColors: BG_COLORS,
    activeBg: BG_COLORS[0],
    matrixSize: 0,
    generated: false,
    rendering: false,
  },

  onLoad() {
    recordToolUse("qrcode");
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

  onInput(e) {
    this.setData({
      content: e.detail.value || "",
    });
  },

  onSelectSize(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ activeSizeIndex: index });
    if (this.data.generated) {
      this.renderQr();
    }
  },

  onSelectFg(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ activeFg: color });
    if (this.data.generated) {
      this.renderQr();
    }
  },

  onSelectBg(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ activeBg: color });
    if (this.data.generated) {
      this.renderQr();
    }
  },

  onGenerate() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: "请输入内容", icon: "none" });
      return;
    }
    this.setData({ generated: true });
    this.renderQr();
  },

  async renderQr() {
    this.setData({ rendering: true });
    try {
      const matrix = generateQrMatrix(this.data.content, "M");
      const canvasRes = await this.getCanvasNode("qrCanvas");
      const canvas = canvasRes.node;
      const ctx = canvas.getContext("2d");
      const dpr = wx.getWindowInfo().pixelRatio || 2;

      canvas.width = PREVIEW_CANVAS_SIZE * dpr;
      canvas.height = PREVIEW_CANVAS_SIZE * dpr;
      ctx.scale(dpr, dpr);

      this.drawQrToCanvas(ctx, matrix, PREVIEW_CANVAS_SIZE);
      this.setData({ matrixSize: matrix.length });
    } catch (error) {
      wx.showToast({ title: "二维码生成失败", icon: "none" });
    } finally {
      this.setData({ rendering: false });
    }
  },

  drawQrToCanvas(ctx, matrix, size) {
    ctx.clearRect(0, 0, size, size);
    if (this.data.activeBg !== "transparent") {
      ctx.setFillStyle(this.data.activeBg);
      ctx.fillRect(0, 0, size, size);
    }
    ctx.setFillStyle(this.data.activeFg);
    const count = matrix.length;
    const cell = size / count;
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (matrix[row][col]) {
          const x = Math.floor(col * cell);
          const y = Math.floor(row * cell);
          const w = Math.ceil((col + 1) * cell) - x;
          const h = Math.ceil((row + 1) * cell) - y;
          ctx.fillRect(x, y, w, h);
        }
      }
    }
  },

  getCanvasNode(canvasId) {
    const query = wx.createSelectorQuery().in(this);
    return new Promise((resolve, reject) => {
      query
        .select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            reject(new Error("Canvas 初始化失败"));
            return;
          }
          resolve(res[0]);
        });
    });
  },

  async onSave() {
    if (!this.data.generated) {
      wx.showToast({ title: "请先生成二维码", icon: "none" });
      return;
    }

    showRewardedVideo(
      async () => {
        try {
          const matrix = generateQrMatrix(this.data.content, "M");
          const outputSize = this.data.sizeOptions[this.data.activeSizeIndex] || 400;
          const canvasRes = await this.getCanvasNode("saveCanvas");
          const canvas = canvasRes.node;
          const ctx = canvas.getContext("2d");
          const dpr = wx.getWindowInfo().pixelRatio || 2;

          canvas.width = outputSize * dpr;
          canvas.height = outputSize * dpr;
          ctx.scale(dpr, dpr);
          this.drawQrToCanvas(ctx, matrix, outputSize);

          const output = await new Promise((resolve, reject) => {
            wx.canvasToTempFilePath(
              {
                canvas,
                fileType: "png",
                width: outputSize,
                height: outputSize,
                destWidth: outputSize,
                destHeight: outputSize,
                success: resolve,
                fail: reject,
              },
              this
            );
          });
          await saveImageToAlbum(output.tempFilePath);
          wx.showToast({ title: "二维码已保存", icon: "success" });
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
