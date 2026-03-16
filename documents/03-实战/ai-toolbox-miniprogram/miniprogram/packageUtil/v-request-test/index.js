const app = getApp();

Page({
  data: {
    statusBarHeight: 44,
    apiUrl: "https://v.api.aa1.cn/api/yiyan/index.php",
    loading: false,
    result: "",
    parsedText: "",
    error: "",
    statusCode: 0,
    costTime: 0,
    showTip: true,
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
    });
  },

  goBack() {
    wx.navigateBack();
  },

  closeTip() {
    this.setData({ showTip: false });
  },

  async fetchYiyan() {
    this.setData({
      loading: true,
      result: "",
      parsedText: "",
      error: "",
      statusCode: 0,
      costTime: 0,
    });

    const startTime = Date.now();

    try {
      const res = await wx.vrequest({
        url: this.data.apiUrl,
        method: "GET",
      });

      const costTime = Date.now() - startTime;
      const raw = res.data || "";

      const match = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const parsedText = match ? match[1].trim() : "";

      this.setData({
        result: raw,
        parsedText,
        statusCode: res.statusCode,
        costTime,
        loading: false,
      });
    } catch (err) {
      this.setData({
        error: JSON.stringify(err, null, 2),
        costTime: Date.now() - startTime,
        loading: false,
      });
    }
  },
});
