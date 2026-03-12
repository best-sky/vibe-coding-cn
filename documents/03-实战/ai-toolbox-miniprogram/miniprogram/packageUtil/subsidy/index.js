const { recordToolUse } = require("../../utils/storage");

const CHILD_OPTIONS = [
  { key: "1", label: "一孩" },
  { key: "2", label: "二孩" },
  { key: "3", label: "三孩" },
];

const REGIONS = [
  { key: "national", label: "全国通用" },
  { key: "wenzhou", label: "温州", extra2: 500, extra3: 800, note: "二孩月补500元，三孩月补800元" },
  { key: "jinan", label: "济南", extra2: 600, extra3: 600, note: "二孩三孩月补600元" },
  { key: "panzhihua", label: "攀枝花", extra2: 500, extra3: 500, note: "二孩三孩月补500元" },
  { key: "hefei", label: "合肥", lump2: 2000, lump3: 5000, note: "二孩一次性2000元，三孩一次性5000元" },
  { key: "ningxia", label: "宁夏", lump2: 2000, lump3: 4000, extra2: 200, extra3: 200, note: "二孩一次性2000+月补200，三孩一次性4000+月补200" },
];

const NATIONAL_MONTHLY = 300;
const POLICY_START = new Date("2025-01-01");

function monthsBetween(start, end) {
  if (end <= start) return 0;
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function calcSubsidy(childOrder, regionKey, birthDate) {
  const region = REGIONS.find((r) => r.key === regionKey) || REGIONS[0];
  const order = Number(childOrder);
  const birth = new Date(birthDate);

  const thirdBirthday = new Date(birth);
  thirdBirthday.setFullYear(thirdBirthday.getFullYear() + 3);

  const eligibleStart = birth >= POLICY_START ? birth : POLICY_START;

  if (eligibleStart >= thirdBirthday) {
    return {
      eligible: false,
      reason: "孩子在政策生效前已满3周岁，不符合申领条件",
    };
  }

  const totalMonths = monthsBetween(eligibleStart, thirdBirthday);
  const nationalTotal = totalMonths * NATIONAL_MONTHLY;

  let localMonthly = 0;
  let localLump = 0;
  if (order >= 2) {
    localMonthly = (order === 2 ? region.extra2 : region.extra3) || 0;
    localLump = (order === 2 ? region.lump2 : region.lump3) || 0;
  }

  const localMonthlyTotal = localMonthly * totalMonths;
  const localTotal = localMonthlyTotal + localLump;
  const grandTotal = nationalTotal + localTotal;

  const now = new Date();
  const pastMonths = Math.max(0, monthsBetween(eligibleStart, now > thirdBirthday ? thirdBirthday : now));
  const remainMonths = Math.max(0, totalMonths - pastMonths);

  return {
    eligible: true,
    totalMonths,
    pastMonths,
    remainMonths,
    nationalMonthly: NATIONAL_MONTHLY,
    nationalTotal,
    localMonthly,
    localMonthlyTotal,
    localLump,
    localTotal,
    grandTotal,
    regionNote: region.note || "",
    thirdBirthday: formatDate(thirdBirthday),
  };
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getToday() {
  return formatDate(new Date());
}

Page({
  data: {
    statusBarHeight: 44,
    childOptions: CHILD_OPTIONS,
    regions: REGIONS,
    activeChild: "1",
    activeRegion: "national",
    birthDate: "",
    birthDisplay: "",
    today: "",
    startDate: "2022-01-01",
    result: null,
    calculated: false,
  },

  onLoad() {
    recordToolUse("subsidy");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
    this.setData({ today: getToday() });
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectChild(e) {
    this.setData({ activeChild: e.currentTarget.dataset.key });
    if (this.data.calculated) this.doCalc();
  },

  onSelectRegion(e) {
    this.setData({ activeRegion: e.currentTarget.dataset.key });
    if (this.data.calculated) this.doCalc();
  },

  onDateChange(e) {
    const date = e.detail.value;
    const parts = date.split("-");
    const display = `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`;
    this.setData({
      birthDate: date,
      birthDisplay: display,
    });
    if (this.data.calculated) this.doCalc();
  },

  onCalc() {
    if (!this.data.birthDate) {
      wx.showToast({ title: "请选择出生日期", icon: "none" });
      return;
    }
    this.setData({ calculated: true });
    this.doCalc();
  },

  doCalc() {
    if (!this.data.birthDate) return;
    const result = calcSubsidy(this.data.activeChild, this.data.activeRegion, this.data.birthDate);
    this.setData({ result });
  },
});
