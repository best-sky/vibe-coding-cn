let rewardedVideoAd = null;
let interstitialAd = null;
let lastInterstitialTs = 0;

const AD_UNIT = {
  rewarded: "adunit-placeholder-rewarded",
  interstitial: "adunit-placeholder-interstitial",
  banner: "adunit-placeholder-banner",
};

function showRewardedVideo(onSuccess, onFail) {
  if (!wx.createRewardedVideoAd) {
    if (typeof onSuccess === "function") onSuccess();
    return;
  }

  if (!rewardedVideoAd) {
    rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: AD_UNIT.rewarded });
  }

  rewardedVideoAd
    .show()
    .catch(() => rewardedVideoAd.load().then(() => rewardedVideoAd.show()))
    .then(() => {
      rewardedVideoAd.offClose();
      rewardedVideoAd.onClose((res) => {
        if (res && res.isEnded) {
          if (typeof onSuccess === "function") onSuccess();
          return;
        }
        if (typeof onFail === "function") onFail(new Error("未完整观看广告"));
      });
    })
    .catch((err) => {
      // 广告异常直接降级
      if (typeof onSuccess === "function") onSuccess();
      if (typeof onFail === "function") onFail(err);
    });
}

function createBanner() {
  if (!wx.createBannerAd) return null;
  try {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : { windowWidth: 375, windowHeight: 667 };
    const banner = wx.createBannerAd({
      adUnitId: AD_UNIT.banner,
      style: {
        left: 0,
        top: info.windowHeight - 80,
        width: info.windowWidth,
      },
    });
    banner.show().catch(() => null);
    return banner;
  } catch (e) {
    return null;
  }
}

function showInterstitial() {
  const now = Date.now();
  if (now - lastInterstitialTs < 5 * 60 * 1000) return;
  if (!wx.createInterstitialAd) return;

  if (!interstitialAd) {
    interstitialAd = wx.createInterstitialAd({ adUnitId: AD_UNIT.interstitial });
  }

  interstitialAd
    .show()
    .then(() => {
      lastInterstitialTs = now;
    })
    .catch(() => null);
}

module.exports = {
  showRewardedVideo,
  createBanner,
  showInterstitial,
};
