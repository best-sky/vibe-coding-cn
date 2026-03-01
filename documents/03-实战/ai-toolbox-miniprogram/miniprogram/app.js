App({
  globalData: {
    themeColor: "#171717",
    cloudReady: false,
  },
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: "your-cloud-env-id",
        traceUser: true,
      });
      this.globalData.cloudReady = true;
    }
  },
});
