const { recordToolUse } = require("../../utils/storage");
const { streamChat } = require("../../services/ai-service");
const {
  ATTRIBUTES,
  ATTR_LABELS,
  getStageLabel,
  pickEvent,
  applyEffects,
  checkDeath,
  buildEventPrompt,
} = require("../../utils/life-events");

const TOTAL_POINTS = 20;

const AI_TRIGGER_TAGS = [
  "exam", "love", "career", "accident", "illness", "family",
  "luck", "fame", "achievement", "end", "birth",
];

function shouldUseAI(event, age) {
  if (!event.tags) return false;
  const hasKeyTag = event.tags.some((t) => AI_TRIGGER_TAGS.includes(t));
  const bigEffect = Object.values(event.effects || {}).some((v) => Math.abs(v) >= 3);
  const isMilestoneAge = [0, 6, 12, 15, 18, 22, 30, 50, 60].includes(age);
  return hasKeyTag || bigEffect || isMilestoneAge;
}

Page({
  data: {
    statusBarHeight: 44,
    phase: "setup",
    attrs: { looks: 5, intelligence: 5, health: 5, wealth: 5 },
    attrLabels: ATTR_LABELS,
    remainingPoints: 0,
    age: 0,
    stageName: "婴幼儿",
    events: [],
    currentEventText: "",
    aiNarration: "",
    isGenerating: false,
    isDead: false,
    isAutoMode: false,
    attrKeys: ATTRIBUTES,
    isAiEvent: false,
  },

  onLoad() {
    recordToolUse("life-simulator");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onAttrChange(e) {
    const { attr, delta } = e.currentTarget.dataset;
    const d = Number(delta);
    const { attrs, remainingPoints } = this.data;
    const cur = attrs[attr];
    const next = cur + d;

    if (next < 1 || next > 10) return;
    if (d > 0 && remainingPoints <= 0) return;
    if (d < 0 && remainingPoints >= TOTAL_POINTS - ATTRIBUTES.length) return;

    this.setData({
      [`attrs.${attr}`]: next,
      remainingPoints: remainingPoints - d,
    });
  },

  onRandomAttrs() {
    let points = TOTAL_POINTS;
    const newAttrs = {};
    const shuffled = [...ATTRIBUTES].sort(() => Math.random() - 0.5);

    shuffled.forEach((attr, i) => {
      if (i === shuffled.length - 1) {
        newAttrs[attr] = Math.max(1, Math.min(10, points));
      } else {
        const maxForThis = Math.min(10, points - (shuffled.length - i - 1));
        const val = 1 + Math.floor(Math.random() * (maxForThis - 1 + 1));
        newAttrs[attr] = val;
        points -= val;
      }
    });

    this.setData({ attrs: newAttrs, remainingPoints: 0 });
  },

  onStartLife() {
    const { remainingPoints } = this.data;
    if (remainingPoints > 0) {
      wx.showToast({ title: `还有${remainingPoints}点未分配`, icon: "none" });
      return;
    }

    const birthEvent = {
      age: 0,
      text: "你出生了",
      effects: {},
      tags: ["birth"],
    };

    this.setData({
      phase: "living",
      age: 0,
      events: [birthEvent],
      currentEventText: "你出生了",
      aiNarration: "",
      isDead: false,
      isAiEvent: true,
    });

    this._processEvent(birthEvent, true);
  },

  async onNextYear() {
    if (this.data.isGenerating || this.data.isDead) return;

    const { age, attrs, events } = this.data;
    const nextAge = age + 1;

    if (checkDeath(nextAge, attrs.health)) {
      this._handleDeath(nextAge);
      return;
    }

    const event = pickEvent(nextAge, attrs);
    if (!event) {
      this._handleDeath(nextAge);
      return;
    }

    if (event.tags && event.tags.includes("end") && nextAge > 75) {
      this._handleDeath(nextAge);
      return;
    }

    const newAttrs = applyEffects(attrs, event.effects);
    const newEvent = {
      age: nextAge,
      text: event.text,
      effects: event.effects,
      tags: event.tags,
    };
    const useAI = shouldUseAI(event, nextAge);

    this.setData({
      age: nextAge,
      stageName: getStageLabel(nextAge),
      attrs: newAttrs,
      events: [...events, newEvent],
      currentEventText: event.text,
      aiNarration: "",
      isAiEvent: useAI,
    });

    await this._processEvent(newEvent, useAI);

    if (newAttrs.health <= 0) {
      this._handleDeath(nextAge);
    }
  },

  async _processEvent(event, useAI) {
    if (useAI) {
      this.setData({ isGenerating: true, aiNarration: "" });
      const { age, attrs, events } = this.data;
      const stageName = getStageLabel(age);
      const prompt = buildEventPrompt(age, stageName, event.text, attrs, events);
      let narration = "";

      try {
        await streamChat("你是一个人生故事叙述者。", prompt, (chunk) => {
          narration += chunk;
          this.setData({ aiNarration: narration });
        });
      } catch (err) {
        console.warn("AI narration failed, using fallback:", err);
        this.setData({ aiNarration: event.text });
      }

      this.setData({ isGenerating: false });
    }

    if (this.data.isAutoMode && !this.data.isDead) {
      const delay = useAI ? 1500 : 600;
      this._autoTimer = setTimeout(() => this.onNextYear(), delay);
    }
  },

  _handleDeath(age) {
    this.setData({ isDead: true, age, isAutoMode: false });
    if (this._autoTimer) {
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
    }
  },

  onShowSummary() {
    const { attrs, events, age } = this.data;
    const app = getApp();
    const existing = app.globalData._lifeSimulatorData;
    if (!existing || existing.age !== age) {
      app.globalData._lifeSimulatorData = { attrs, events, age };
    }
    wx.navigateTo({ url: "/packageText/life-summary/index" });
  },

  onRestart() {
    if (this._autoTimer) {
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
    }
    this.setData({
      phase: "setup",
      attrs: { looks: 5, intelligence: 5, health: 5, wealth: 5 },
      remainingPoints: 0,
      age: 0,
      stageName: "婴幼儿",
      events: [],
      currentEventText: "",
      aiNarration: "",
      isGenerating: false,
      isDead: false,
      isAutoMode: false,
      isAiEvent: false,
    });
  },

  onToggleAuto() {
    const next = !this.data.isAutoMode;
    this.setData({ isAutoMode: next });
    if (next && !this.data.isGenerating && !this.data.isDead) {
      this.onNextYear();
    } else if (!next && this._autoTimer) {
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
    }
  },

  onUnload() {
    if (this._autoTimer) {
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
    }
  },
});
