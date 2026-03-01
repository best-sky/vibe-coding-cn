const { streamChat } = require("../../services/ai-service");
const { recordToolUse } = require("../../utils/storage");

Page({
  data: {
    requirement: "",
    loading: false,
    names: [],
  },

  onLoad() {
    recordToolUse("naming");
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({
      requirement: e.detail.value || "",
    });
  },

  async onGenerate() {
    const requirement = this.data.requirement.trim();
    if (!requirement) {
      wx.showToast({ title: "请先输入需求", icon: "none" });
      return;
    }
    this.setData({ loading: true, names: [] });

    const prompt = `请按 JSON 数组返回 6 个名字，字段为 name 和 meaning。需求：${requirement}`;
    let raw = "";
    try {
      await streamChat("你是中文起名专家，输出要简洁、吉祥、不过度生僻。", prompt, (chunk) => {
        raw += chunk;
      });
      const jsonText = raw.match(/\[[\s\S]*\]/)?.[0] || "[]";
      const parsed = JSON.parse(jsonText);
      const names = Array.isArray(parsed) ? parsed.slice(0, 10) : [];
      this.setData({ names });
    } catch (err) {
      wx.showToast({ title: "生成失败，请重试", icon: "none" });
    } finally {
      this.setData({ loading: false });
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
