const { vrequest } = require("./utils/v-request");

App({
  globalData: {
    themeColor: "#171717",
    cloudReady: false,
    statusBarHeight: 44,
  },
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: "cloud1-0gy52uie0deb5048",
      });
      this.globalData.cloudReady = true;
      wx.vrequest = vrequest;
    }
    const systemInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight || 44;
  },
});
