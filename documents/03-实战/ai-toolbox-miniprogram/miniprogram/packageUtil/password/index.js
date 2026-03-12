const { recordToolUse } = require("../../utils/storage");

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

const LENGTH_OPTIONS = [8, 12, 16, 20, 24, 32];

function generatePassword(length, options) {
  let pool = "";
  const required = [];

  if (options.upper) {
    pool += CHARSETS.upper;
    required.push(CHARSETS.upper);
  }
  if (options.lower) {
    pool += CHARSETS.lower;
    required.push(CHARSETS.lower);
  }
  if (options.digits) {
    pool += CHARSETS.digits;
    required.push(CHARSETS.digits);
  }
  if (options.symbols) {
    pool += CHARSETS.symbols;
    required.push(CHARSETS.symbols);
  }

  if (!pool) return "";

  const arr = new Array(length);
  for (let i = 0; i < required.length && i < length; i++) {
    const charset = required[i];
    arr[i] = charset[Math.floor(Math.random() * charset.length)];
  }
  for (let i = required.length; i < length; i++) {
    arr[i] = pool[Math.floor(Math.random() * pool.length)];
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join("");
}

function evaluateStrength(password) {
  if (!password) return { level: 0, label: "无", color: "#A3A3A3" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: "弱", color: "#EF4444" };
  if (score <= 4) return { level: 2, label: "中", color: "#EAB308" };
  if (score <= 5) return { level: 3, label: "强", color: "#22C55E" };
  return { level: 4, label: "极强", color: "#16A34A" };
}

Page({
  data: {
    statusBarHeight: 44,
    lengthOptions: LENGTH_OPTIONS,
    activeLengthIndex: 1,
    includeUpper: true,
    includeLower: true,
    includeDigits: true,
    includeSymbols: false,
    password: "",
    strength: { level: 0, label: "无", color: "#A3A3A3" },
    history: [],
    copied: false,
  },

  onLoad() {
    recordToolUse("password");
    const app = getApp();
    if (app && app.globalData) {
      this.setData({ statusBarHeight: app.globalData.statusBarHeight });
    }
    this.doGenerate();
  },

  onBack() {
    wx.navigateBack();
  },

  onSelectLength(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ activeLengthIndex: index });
    this.doGenerate();
  },

  onToggle(e) {
    const key = e.currentTarget.dataset.key;
    const current = this.data[key];
    const active = [
      this.data.includeUpper,
      this.data.includeLower,
      this.data.includeDigits,
      this.data.includeSymbols,
    ].filter(Boolean).length;

    if (current && active <= 1) {
      wx.showToast({ title: "至少保留一种字符", icon: "none" });
      return;
    }
    this.setData({ [key]: !current });
    this.doGenerate();
  },

  doGenerate() {
    const length = LENGTH_OPTIONS[this.data.activeLengthIndex] || 12;
    const password = generatePassword(length, {
      upper: this.data.includeUpper,
      lower: this.data.includeLower,
      digits: this.data.includeDigits,
      symbols: this.data.includeSymbols,
    });
    const strength = evaluateStrength(password);
    const history = [password, ...this.data.history.filter((p) => p !== password)].slice(0, 5);
    this.setData({ password, strength, history, copied: false });
  },

  onCopy() {
    if (!this.data.password) return;
    wx.setClipboardData({
      data: this.data.password,
      success: () => {
        this.setData({ copied: true });
      },
    });
  },

  onCopyHistory(e) {
    const pw = e.currentTarget.dataset.pw;
    if (!pw) return;
    wx.setClipboardData({ data: pw });
  },

  onRefresh() {
    this.doGenerate();
  },
});
