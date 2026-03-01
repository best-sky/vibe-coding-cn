function hexToRgb(hex) {
  const pureHex = hex.replace("#", "");
  const bigint = Number.parseInt(pureHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function isNearBackground(r, g, b) {
  // 简易背景阈值：识别偏白/浅色区域
  return r > 210 && g > 210 && b > 210;
}

function replaceBackground(imageData, hexColor) {
  const { r: tr, g: tg, b: tb } = hexToRgb(hexColor);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isNearBackground(r, g, b)) {
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
      data[i + 3] = 255;
    }
  }
  return imageData;
}

function getSizeRatio(size) {
  if (!size || !size.widthMm || !size.heightMm) return 25 / 35;
  return size.widthMm / size.heightMm;
}

function calcCropRect(width, height, size) {
  const ratio = getSizeRatio(size);
  const imgRatio = width / height;

  if (imgRatio > ratio) {
    const cropWidth = Math.floor(height * ratio);
    const x = Math.floor((width - cropWidth) / 2);
    return { x, y: 0, width: cropWidth, height };
  }

  const cropHeight = Math.floor(width / ratio);
  const y = Math.floor((height - cropHeight) / 2);
  return { x: 0, y, width, height: cropHeight };
}

module.exports = {
  replaceBackground,
  calcCropRect,
};
