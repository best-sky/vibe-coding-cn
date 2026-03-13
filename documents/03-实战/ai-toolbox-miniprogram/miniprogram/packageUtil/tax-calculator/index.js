const { recordToolUse } = require("../../utils/storage");
const {
  SPECIAL_DEDUCTION_ITEMS,
  INSURANCE_DEFAULTS,
  calcMonthlyTax,
  calcBonusTax,
} = require("../../utils/tax-helper");

const STORAGE_KEY = "tax_calc_cache";

const MODE_OPTIONS = [
  { key: "monthly", label: "月薪计算" },
  { key: "bonus", label: "年终奖计算" },
];

function loadCache() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || {};
  } catch (e) {
    return {};
  }
}

function saveCache(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, data);
  } catch (e) {}
}

Page({
  data: {
    statusBarHeight: 44,
    modeOptions: MODE_OPTIONS,
    activeMode: "monthly",
    specialItems: SPECIAL_DEDUCTION_ITEMS,

    salary: "",
    bonus: "",
    pension: "8",
    medical: "2",
    unemployment: "0.5",
    housingFund: "7",
    selectedSpecials: [],
    selectedSpecialsMap: {},

    calculated: false,
    monthResult: null,
    bonusResult: null,
    showDetail: false,
  },

  onLoad() {
    recordToolUse("tax-calculator");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
    const cache = loadCache();
    if (cache.salary) {
      const specials = cache.selectedSpecials || [];
      const specialsMap = {};
      specials.forEach((k) => { specialsMap[k] = true; });
      this.setData({
        salary: cache.salary,
        pension: cache.pension || "8",
        medical: cache.medical || "2",
        unemployment: cache.unemployment || "0.5",
        housingFund: cache.housingFund || "7",
        selectedSpecials: specials,
        selectedSpecialsMap: specialsMap,
      });
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onModeChange(e) {
    this.setData({
      activeMode: e.currentTarget.dataset.key,
      calculated: false,
      monthResult: null,
      bonusResult: null,
      showDetail: false,
    });
  },

  onSalaryInput(e) {
    this.setData({ salary: e.detail.value });
  },

  onBonusInput(e) {
    this.setData({ bonus: e.detail.value });
  },

  onPensionInput(e) {
    this.setData({ pension: e.detail.value });
  },

  onMedicalInput(e) {
    this.setData({ medical: e.detail.value });
  },

  onUnemploymentInput(e) {
    this.setData({ unemployment: e.detail.value });
  },

  onHousingFundInput(e) {
    this.setData({ housingFund: e.detail.value });
  },

  onToggleSpecial(e) {
    const key = e.currentTarget.dataset.key;
    const list = this.data.selectedSpecials.slice();
    const map = Object.assign({}, this.data.selectedSpecialsMap);
    const idx = list.indexOf(key);
    if (idx >= 0) {
      list.splice(idx, 1);
      delete map[key];
    } else {
      list.push(key);
      map[key] = true;
    }
    this.setData({ selectedSpecials: list, selectedSpecialsMap: map });
  },

  onCalc() {
    if (this.data.activeMode === "monthly") {
      this.calcMonthly();
    } else {
      this.calcBonus();
    }
  },

  calcMonthly() {
    const salary = parseFloat(this.data.salary);
    if (!salary || salary <= 0) {
      wx.showToast({ title: "请输入有效的月薪", icon: "none" });
      return;
    }

    const insuranceRates = {
      pension: parseFloat(this.data.pension) / 100 || 0,
      medical: parseFloat(this.data.medical) / 100 || 0,
      unemployment: parseFloat(this.data.unemployment) / 100 || 0,
      housingFund: parseFloat(this.data.housingFund) / 100 || 0,
    };

    const result = calcMonthlyTax(salary, insuranceRates, this.data.selectedSpecials);
    this.setData({ calculated: true, monthResult: result, showDetail: false });

    saveCache({
      salary: this.data.salary,
      pension: this.data.pension,
      medical: this.data.medical,
      unemployment: this.data.unemployment,
      housingFund: this.data.housingFund,
      selectedSpecials: this.data.selectedSpecials,
    });
  },

  calcBonus() {
    const bonus = parseFloat(this.data.bonus);
    if (!bonus || bonus <= 0) {
      wx.showToast({ title: "请输入有效的年终奖金额", icon: "none" });
      return;
    }
    const result = calcBonusTax(bonus);
    this.setData({ calculated: true, bonusResult: result });
  },

  onToggleDetail() {
    this.setData({ showDetail: !this.data.showDetail });
  },
});
