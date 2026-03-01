App({
  globalData: {
    themeColor: "#171717",
    cloudReady: false,
    statusBarHeight: 44,
  },
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: "your-cloud-env-id",
        traceUser: true,
      });
      this.globalData.cloudReady = true;
    }
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight || 44;
  },
});
