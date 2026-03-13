const { recordToolUse } = require("../../utils/storage");
const { RELATION_BUTTONS } = require("../../utils/relative-data");
const { resolveRelation, getAvailableRelations } = require("../../utils/relative-engine");

const GENDER_OPTIONS = [
  { key: "male", label: "我是男生" },
  { key: "female", label: "我是女生" },
];

Page({
  data: {
    statusBarHeight: 44,
    genderOptions: GENDER_OPTIONS,
    allButtons: RELATION_BUTTONS,
    availableKeys: [],
    availableMap: {},
    activeGender: "male",
    chain: [],
    chainLabels: [],
    result: null,
  },

  onLoad() {
    recordToolUse("relative-calc");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
    this.refreshAvailable();
  },

  onBack() {
    wx.navigateBack();
  },

  onGenderChange(e) {
    const gender = e.currentTarget.dataset.key;
    this.setData({ activeGender: gender });
    if (this.data.chain.length > 0) {
      this.computeResult();
    }
  },

  onSelectRelation(e) {
    const key = e.currentTarget.dataset.key;
    if (!this.data.availableMap[key]) return;

    const btn = this.data.allButtons.find((b) => b.key === key);
    if (!btn) return;

    const chain = this.data.chain.concat(key);
    const chainLabels = this.data.chainLabels.concat(btn.label);

    this.setData({ chain, chainLabels });
    this.computeResult();
    this.refreshAvailable(chain);
  },

  onUndo() {
    if (this.data.chain.length === 0) return;
    const chain = this.data.chain.slice(0, -1);
    const chainLabels = this.data.chainLabels.slice(0, -1);
    this.setData({ chain, chainLabels });

    if (chain.length > 0) {
      this.computeResult(chain);
    } else {
      this.setData({ result: null });
    }
    this.refreshAvailable(chain);
  },

  onClear() {
    this.setData({
      chain: [],
      chainLabels: [],
      result: null,
    });
    this.refreshAvailable([]);
  },

  computeResult(chainOverride) {
    const chain = chainOverride || this.data.chain;
    const raw = resolveRelation(chain);
    const isMale = this.data.activeGender === "male";
    this.setData({
      result: {
        found: raw.found,
        title: raw.title,
        reverse: isMale ? raw.reverseM : raw.reverseF,
      },
    });
  },

  refreshAvailable(chainOverride) {
    const chain = chainOverride || this.data.chain;
    const available = getAvailableRelations(chain);
    const availableMap = {};
    available.forEach((k) => { availableMap[k] = true; });
    this.setData({ availableKeys: available, availableMap });
  },
});
