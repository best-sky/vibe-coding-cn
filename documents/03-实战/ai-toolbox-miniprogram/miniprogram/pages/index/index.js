const { TOOL_LIST, TOOL_CATEGORIES } = require("../../utils/constants");
const { getUsageMap, recordToolUse } = require("../../utils/storage");

const app = getApp();

Page({
  data: {
    searchKeyword: "",
    statusBarHeight: 44,
    categories: [
      { key: "image", name: TOOL_CATEGORIES.image, tools: [] },
      { key: "text", name: TOOL_CATEGORIES.text, tools: [] },
      { key: "util", name: TOOL_CATEGORIES.util, tools: [] },
    ],
    filteredCategories: []
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight
    });
  },

  onShow() {
    this.refreshTools();
  },

  refreshTools() {
    const usageMap = getUsageMap();
    const tools = TOOL_LIST.map((tool) => ({
      ...tool,
      usageCount: usageMap[tool.id] || 0,
    }));

    // 初始化分类
    let categoriesData = [
      { key: "image", name: TOOL_CATEGORIES.image, tools: [] },
      { key: "text", name: TOOL_CATEGORIES.text, tools: [] },
      { key: "util", name: TOOL_CATEGORIES.util, tools: [] },
    ];

    // 将工具分配到各自的分类中
    tools.forEach(tool => {
      const cat = categoriesData.find(c => c.key === tool.category);
      if (cat) {
        cat.tools.push(tool);
      }
    });

    this.setData({
      categories: categoriesData,
    });
    
    this.applyFilters();
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value || "",
    });
    this.applyFilters();
  },

  applyFilters() {
    const { categories, searchKeyword } = this.data;
    const keyword = (searchKeyword || "").trim().toLowerCase();
    
    let filteredCategories = [];

    categories.forEach(cat => {
      const filteredTools = cat.tools.filter((tool) => {
        return !keyword || 
               tool.name.toLowerCase().includes(keyword) || 
               tool.desc.toLowerCase().includes(keyword);
      });
      
      if (filteredTools.length > 0) {
        filteredCategories.push({
          ...cat,
          tools: filteredTools
        });
      }
    });

    this.setData({ filteredCategories });
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
