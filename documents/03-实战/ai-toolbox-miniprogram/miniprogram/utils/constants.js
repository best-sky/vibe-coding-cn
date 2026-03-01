const TOOL_CATEGORIES = {
  all: "全部",
  image: "AI 图片",
  text: "AI 文字",
  util: "实用工具",
};

const TOOL_LIST = [
  {
    id: "id-photo",
    name: "AI 证件照",
    desc: "一键换底色与尺寸裁剪",
    category: "image",
    path: "/packageImage/id-photo/index",
    icon: "🪪",
  },
  {
    id: "compress",
    name: "图片压缩",
    desc: "无损压缩，体积更小",
    category: "image",
    path: "/packageImage/compress/index",
    icon: "🗜️",
  },
  {
    id: "copywriting",
    name: "AI 文案生成",
    desc: "小红书/朋友圈文案",
    category: "text",
    path: "/packageText/copywriting/index",
    icon: "✍️",
  },
  {
    id: "naming",
    name: "AI 起名字",
    desc: "多场景智能取名",
    category: "text",
    path: "/packageText/naming/index",
    icon: "📛",
  },
  {
    id: "word-count",
    name: "字数统计",
    desc: "实时统计字数与段落",
    category: "util",
    path: "/packageUtil/word-count/index",
    icon: "🔢",
  },
  {
    id: "coming-soon",
    name: "更多工具",
    desc: "持续上新中",
    category: "all",
    path: "",
    icon: "✨",
  },
];

const ID_PHOTO_SIZES = [
  { key: "one", label: "1 寸", widthMm: 25, heightMm: 35 },
  { key: "two", label: "2 寸", widthMm: 35, heightMm: 49 },
  { key: "smallTwo", label: "小 2 寸", widthMm: 35, heightMm: 45 },
];

const BG_COLORS = [
  { key: "white", color: "#FFFFFF" },
  { key: "red", color: "#EF4444" },
  { key: "blue", color: "#3B82F6" },
  { key: "gray", color: "#D4D4D4" },
];

module.exports = {
  TOOL_CATEGORIES,
  TOOL_LIST,
  ID_PHOTO_SIZES,
  BG_COLORS,
};
