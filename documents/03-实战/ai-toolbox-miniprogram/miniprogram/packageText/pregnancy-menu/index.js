const { agentChat, streamChat } = require("../../services/ai-service");
const { recordToolUse } = require("../../utils/storage");
const { AGENT_IDS } = require("../../utils/constants");

const TRIMESTERS = ["孕早期(1-3月)", "孕中期(4-6月)", "孕晚期(7-9月)", "产后恢复期"];
const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

Page({
  data: {
    trimesters: TRIMESTERS,
    activeTrimester: TRIMESTERS[0],
    preference: "",
    loading: false,
    rawText: "",
    menuDays: [],
    activeDay: 0,
    isGenerating: false,
    statusBarHeight: 44,
  },

  _aborted: false,

  onLoad() {
    recordToolUse("pregnancy-menu");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ preference: e.detail.value || "" });
  },

  onSelectTrimester(e) {
    this.setData({ activeTrimester: e.currentTarget.dataset.value });
  },

  onSelectDay(e) {
    this.setData({ activeDay: e.currentTarget.dataset.index });
  },

  async onGenerate() {
    if (this.data.loading) return;

    this._aborted = false;
    this.setData({ loading: true, rawText: "", menuDays: [], activeDay: 0, isGenerating: true });

    const trimester = this.data.activeTrimester;
    const preference = this.data.preference.trim();
    const systemPrompt = "你是一位专业的孕期营养师，精通不同孕周的营养需求。请根据孕期阶段生成科学、均衡、可操作的一周菜谱。";
    const prefText = preference ? `\n饮食偏好/禁忌：${preference}` : "";
    const userPrompt = `孕期阶段：${trimester}${prefText}\n\n请为我生成一周七天的孕期菜谱，每天包含早餐、午餐、晚餐和加餐（上午/下午各一个），请严格按以下格式输出每一天：\n\n【周X】\n早餐：xxx\n午餐：xxx\n晚餐：xxx\n加餐：xxx\n营养说明：xxx\n\n请确保每天的菜品不同且营养均衡，注明关键营养素。直接输出菜谱，不要多余内容。`;

    let raw = "";
    const handleChunk = (chunk) => {
      if (this._aborted) return;
      raw += chunk;
      this.setData({ rawText: raw });
      this._parseMenu(raw);
    };

    try {
      const agentId = AGENT_IDS["pregnancy-menu"];
      if (agentId && !agentId.includes("xxx")) {
        await agentChat(agentId, userPrompt, handleChunk);
      } else {
        await streamChat(systemPrompt, userPrompt, handleChunk);
      }
      this._parseMenu(raw);
    } catch (err) {
      if (this._aborted) return;
      if (raw) { this._parseMenu(raw); return; }
      try {
        await streamChat(systemPrompt, userPrompt, handleChunk);
        this._parseMenu(raw);
      } catch (fallbackErr) {
        wx.showToast({ title: "生成失败，请重试", icon: "none" });
      }
    } finally {
      this.setData({ loading: false, isGenerating: false });
    }
  },

  _parseMenu(text) {
    const dayBlocks = text.split(/(?=【周[一二三四五六日]】)/).filter(Boolean);
    const menuDays = [];

    for (const block of dayBlocks) {
      const dayMatch = block.match(/【(周[一二三四五六日])】/);
      if (!dayMatch) continue;

      const day = dayMatch[1];
      const breakfast = this._extractMeal(block, "早餐");
      const lunch = this._extractMeal(block, "午餐");
      const dinner = this._extractMeal(block, "晚餐");
      const snack = this._extractMeal(block, "加餐");
      const nutrition = this._extractMeal(block, "营养说明");

      menuDays.push({ day, breakfast, lunch, dinner, snack, nutrition });
    }

    if (menuDays.length > 0) {
      this.setData({ menuDays });
    }
  },

  _extractMeal(block, label) {
    const regex = new RegExp(label + "[：:]\\s*(.+?)(?=\\n(?:早餐|午餐|晚餐|加餐|营养说明|【|$))", "s");
    const match = block.match(regex);
    if (match) return match[1].trim();
    const simpleRegex = new RegExp(label + "[：:]\\s*(.+)");
    const simpleMatch = block.match(simpleRegex);
    return simpleMatch ? simpleMatch[1].trim() : "";
  },

  onCopyDay(e) {
    const index = e.currentTarget.dataset.index;
    const day = this.data.menuDays[index];
    if (!day) return;
    const text = `【${day.day}】\n早餐：${day.breakfast}\n午餐：${day.lunch}\n晚餐：${day.dinner}\n加餐：${day.snack}\n营养说明：${day.nutrition}`;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },

  onCopyAll() {
    const text = this.data.rawText;
    if (!text) return;
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: "已复制全部", icon: "success" }),
    });
  },

  onShareAppMessage() {
    return {
      title: "孕期一周营养菜谱 — AI 定制专属菜谱",
      path: "/packageText/pregnancy-menu/index",
    };
  },
});
