const { streamChat } = require("../../services/ai-service");
const { recordToolUse } = require("../../utils/storage");

const SCENES = ["宝宝起名", "公司取名", "品牌命名", "笔名/艺名", "宠物起名"];

Page({
  data: {
    scenes: SCENES,
    activeScene: SCENES[0],
    requirement: "",
    loading: false,
    rawText: "",
    names: [],
    statusBarHeight: 44,
  },

  _aborted: false,

  onLoad() {
    recordToolUse("naming");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ requirement: e.detail.value || "" });
  },

  onSelectScene(e) {
    this.setData({ activeScene: e.currentTarget.dataset.value });
  },

  async onGenerate() {
    if (this.data.loading) return;

    const requirement = this.data.requirement.trim();
    if (!requirement) {
      wx.showToast({ title: "请先输入需求", icon: "none" });
      return;
    }

    this._aborted = false;
    this.setData({ loading: true, names: [], rawText: "" });

    const scene = this.data.activeScene;
    const systemPrompt = "你是中文起名专家，擅长根据场景和需求起出寓意好、朗朗上口的名字。";
    const userPrompt = `场景：${scene}\n需求：${requirement}\n\n请推荐6个名字，每个名字用以下格式输出：\n名字：xxx\n寓意：xxx\n\n直接输出，不要其他内容。`;

    let raw = "";
    try {
      await streamChat(systemPrompt, userPrompt, (chunk) => {
        if (this._aborted) return;
        raw += chunk;
        this.setData({ rawText: raw });
        this._parseNames(raw);
      });
      this._parseNames(raw);
    } catch (err) {
      if (!this._aborted) {
        wx.showToast({ title: "生成失败，请重试", icon: "none" });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  _parseNames(text) {
    const blocks = text.split(/(?=名字[：:])/).filter(Boolean);
    const names = [];
    for (const block of blocks) {
      const nameMatch = block.match(/名字[：:]\s*(.+)/);
      const meaningMatch = block.match(/寓意[：:]\s*(.+)/);
      if (nameMatch) {
        names.push({
          name: nameMatch[1].trim(),
          meaning: meaningMatch ? meaningMatch[1].trim() : "",
        });
      }
    }
    if (names.length > 0) {
      this.setData({ names });
    }
  },

  onCopyName(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;
    wx.setClipboardData({
      data: name,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },
});
