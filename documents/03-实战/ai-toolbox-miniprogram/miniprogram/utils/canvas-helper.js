function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    });
  });
}

function canvasToTempFilePath(options) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
}

function chooseSingleImage() {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success(res) {
        if (!res.tempFiles || !res.tempFiles[0]) {
          reject(new Error("未选择图片"));
          return;
        }
        resolve(res.tempFiles[0]);
      },
      fail: reject,
    });
  });
}

function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject,
    });
  });
}

module.exports = {
  getImageInfo,
  canvasToTempFilePath,
  chooseSingleImage,
  saveImageToAlbum,
};
