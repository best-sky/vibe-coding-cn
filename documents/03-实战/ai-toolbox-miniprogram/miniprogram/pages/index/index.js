const { TOOL_LIST, TOOL_CATEGORIES } = require("../../utils/constants");
const { getUsageMap, getRecentTools, recordToolUse } = require("../../utils/storage");

Page({
  data: {
    searchKeyword: "",
    activeCategory: "all",
    categories: [
      { key: "all", name: TOOL_CATEGORIES.all },
      { key: "image", name: TOOL_CATEGORIES.image },
      { key: "text", name: TOOL_CATEGORIES.text },
      { key: "util", name: TOOL_CATEGORIES.util },
    ],
    tools: [],
    filteredTools: [],
    recentTools: [],
    banners: [
      {
        id: "banner1",
        image: "https://images.unsplash.com/photo-1739001410808-0b3ee88d83c9?auto=format&fit=crop&w=1080&q=80",
        title: "证件照快速换底色",
      },
      {
        id: "banner2",
        image: "https://images.unsplash.com/photo-1705255620917-fcc1300ca0fa?auto=format&fit=crop&w=1080&q=80",
        title: "AI 文案一键生成",
      },
    ],
  },

  onShow() {
    this.refreshTools();
  },

  refreshTools() {
    const usageMap = getUsageMap();
    const recentIds = getRecentTools();
    const tools = TOOL_LIST.map((tool) => ({
      ...tool,
      usageCount: usageMap[tool.id] || 0,
    }));
    const recentTools = recentIds
      .map((id) => tools.find((tool) => tool.id === id))
      .filter(Boolean);

    this.setData({
      tools,
      recentTools,
    });
    this.applyFilters();
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value || "",
    });
    this.applyFilters();
  },

  onCategoryTap(e) {
    this.setData({
      activeCategory: e.currentTarget.dataset.key,
    });
    this.applyFilters();
  },

  applyFilters() {
    const { tools, searchKeyword, activeCategory } = this.data;
    const keyword = (searchKeyword || "").trim().toLowerCase();
    const filteredTools = tools.filter((tool) => {
      const matchCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchKeyword =
        !keyword ||
        tool.name.toLowerCase().includes(keyword) ||
        tool.desc.toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    });
    this.setData({ filteredTools });
  },

  onToolTap(e) {
    const { path, id } = e.currentTarget.dataset;
    if (!path) {
      wx.showToast({
        title: "即将上线",
        icon: "none",
      });
      return;
    }
    recordToolUse(id);
    wx.navigateTo({ url: path });
  },
});
