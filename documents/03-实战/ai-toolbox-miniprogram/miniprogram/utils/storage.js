const STORAGE_KEYS = {
  usageMap: "tool_usage_map",
  recentTools: "recent_tool_list",
};

function getUsageMap() {
  return wx.getStorageSync(STORAGE_KEYS.usageMap) || {};
}

function getRecentTools() {
  return wx.getStorageSync(STORAGE_KEYS.recentTools) || [];
}

function recordToolUse(toolId) {
  if (!toolId) return;
  const usageMap = getUsageMap();
  usageMap[toolId] = (usageMap[toolId] || 0) + 1;
  wx.setStorageSync(STORAGE_KEYS.usageMap, usageMap);

  const recent = getRecentTools().filter((id) => id !== toolId);
  recent.unshift(toolId);
  wx.setStorageSync(STORAGE_KEYS.recentTools, recent.slice(0, 6));
}

module.exports = {
  getUsageMap,
  getRecentTools,
  recordToolUse,
};
