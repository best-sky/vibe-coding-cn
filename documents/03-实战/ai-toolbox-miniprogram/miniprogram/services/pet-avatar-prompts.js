/**
 * 宠物Q版头像风格提示词模板
 * 由于混元 createImageModel 不支持参考图（图生图），
 * 采用纯文生图方案：用户描述宠物特征 + 风格提示词 → 生成Q版头像
 */

const PET_STYLES = [
  {
    key: "kawaii",
    label: "日系 Q 版",
    icon: "🎀",
    prompt: "超可爱日系chibi Q版卡通宠物头像，大大的闪亮眼睛，圆脸蛋，软萌表情，柔和粉彩配色，简洁白色背景，高清精致，适合做社交头像",
  },
  {
    key: "pixel",
    label: "像素风",
    icon: "👾",
    prompt: "像素艺术风格宠物头像，16bit复古游戏画风，像素方块构成，鲜明饱和的颜色，简洁纯色背景，可爱复古风格",
  },
  {
    key: "watercolor",
    label: "水彩风",
    icon: "🎨",
    prompt: "唯美水彩画风格宠物头像，柔和的水彩晕染笔触，梦幻渐变淡雅配色，艺术感十足，白色留白背景，温柔治愈系",
  },
  {
    key: "cyberpunk",
    label: "赛博朋克",
    icon: "🌃",
    prompt: "赛博朋克风格宠物头像，霓虹灯光效果，紫色和青色荧光色调，未来科技感，戴着酷炫的科技眼镜，暗色背景搭配发光线条",
  },
  {
    key: "plush",
    label: "毛绒玩具",
    icon: "🧸",
    prompt: "超逼真毛绒玩具风格宠物头像，蓬松柔软的毛绒质感，手工缝制风格的眼睛和鼻子，圆润可爱造型，温暖柔和的室内灯光",
  },
  {
    key: "comic",
    label: "漫画风",
    icon: "💥",
    prompt: "美式漫画风格宠物头像，粗黑线条描边，鲜明对比色彩，波普艺术风格半调网点，充满活力和个性，简洁背景",
  },
];

const PET_TYPES = [
  { key: "cat", label: "猫咪" },
  { key: "dog", label: "狗狗" },
  { key: "rabbit", label: "兔子" },
  { key: "hamster", label: "仓鼠" },
  { key: "bird", label: "小鸟" },
  { key: "other", label: "其他" },
];

function buildPrompt(style, petType, petDesc) {
  const styleObj = PET_STYLES.find((s) => s.key === style);
  if (!styleObj) return "";

  let petInfo = "";
  const typeObj = PET_TYPES.find((t) => t.key === petType);
  if (typeObj && petType !== "other") {
    petInfo = typeObj.label;
  }

  if (petDesc) {
    petInfo = petDesc + (petInfo ? `（${petInfo}）` : "");
  } else if (!petInfo) {
    petInfo = "可爱的小猫";
  }

  return `${styleObj.prompt}，宠物：${petInfo}，正面头像特写，高质量`;
}

module.exports = {
  PET_STYLES,
  PET_TYPES,
  buildPrompt,
};
