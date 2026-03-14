const { generateImage } = require("../../services/ai-service");
const { showRewardedVideo } = require("../../utils/ad-manager");
const { recordToolUse } = require("../../utils/storage");

const STYLES = [
  { key: "minimal", label: "极简清新", prompt: "极简主义设计风格，干净留白，浅色背景，精致排版" },
  { key: "retro", label: "复古文艺", prompt: "复古胶片风格，暖色调，有质感的纹理背景" },
  { key: "cute", label: "可爱插画", prompt: "可爱卡通插画风格，马卡龙色系，圆润线条" },
  { key: "luxury", label: "高级质感", prompt: "高端杂志封面风格，深色背景，金色点缀，精致排版" },
  { key: "nature", label: "自然清新", prompt: "自然田园风格，绿色植物元素，阳光明媚，清新色调" },
  { key: "tech", label: "科技未来", prompt: "科技感设计，深蓝紫渐变，几何线条，发光元素" },
];

const SIZES = [
  { key: "square", label: "1:1 方图", size: "1024x1024" },
  { key: "portrait", label: "3:4 竖图", size: "768x1024" },
];

Page({
  data: {
    styles: STYLES,
    sizes: SIZES,
    activeStyle: STYLES[0].key,
    activeSize: SIZES[1].key,
    topic: "",
    generating: false,
    imageUrl: "",
    statusBarHeight: 44,
    canvasW: 1,
    canvasH: 1,
  },

  onLoad() {
    recordToolUse("xhs-cover");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ topic: e.detail.value || "" });
  },

  onSelectStyle(e) {
    this.setData({ activeStyle: e.currentTarget.dataset.key });
  },

  onSelectSize(e) {
    this.setData({ activeSize: e.currentTarget.dataset.key });
  },

  _buildPrompt() {
    const { topic, activeStyle } = this.data;
    const style = STYLES.find((s) => s.key === activeStyle);
    return `小红书封面图，${style.prompt}，主题内容：${topic}。画面要吸引人点击，构图饱满有设计感，适合社交媒体传播。不要出现任何文字。`;
  },

  _getSize() {
    const item = SIZES.find((s) => s.key === this.data.activeSize);
    return item ? item.size : "768x1024";
  },

  onGenerate() {
    if (this.data.generating) return;

    const topic = this.data.topic.trim();
    if (!topic) {
      wx.showToast({ title: "请先输入封面主题", icon: "none" });
      return;
    }

    showRewardedVideo(async () => {
      this.setData({ generating: true, imageUrl: "" });
      wx.showLoading({ title: "AI 绘图中…", mask: true });

      try {
        const result = await generateImage(this._buildPrompt(), {
          size: this._getSize(),
        });

        if (!result || !result.success) {
          throw new Error(result?.message || "生成失败");
        }

        if (result.imageUrl) {
          this.setData({ imageUrl: result.imageUrl });
        } else {
          throw new Error("未返回图片");
        }
      } catch (err) {
        console.error("generateImage error", err);
        wx.showToast({ title: "图片生成失败，请重试", icon: "none" });
      } finally {
        wx.hideLoading();
        this.setData({ generating: false });
      }
    });
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

  onSave() {
    const { imageUrl } = this.data;
    if (!imageUrl) return;

    wx.showLoading({ title: "保存中…" });

    if (!imageUrl.startsWith("http") || imageUrl.startsWith("http://tmp/")) {
      wx.hideLoading();
      this._saveToAlbum(imageUrl);
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
      img.src = imageUrl;
    });
  },

  onRegenerate() {
    this.onGenerate();
  },
});
