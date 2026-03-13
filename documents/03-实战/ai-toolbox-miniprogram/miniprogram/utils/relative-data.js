/**
 * 中国亲戚关系映射数据
 *
 * 结构说明：
 * - 每个节点 key 代表一种已知关系（从"我"开始）
 * - 值为一个对象，key 是下一步选择的关系，value 是推导后的结果关系 key
 * - 特殊 key "__name" 存放该关系的显示信息
 *
 * __name: { title: 称谓, reverseM: 对方称呼你（男）, reverseF: 对方称呼你（女）}
 */

const RELATION_MAP = {
  me: {
    __name: { title: "我", reverseM: "", reverseF: "" },
    father: "f",
    mother: "m",
    older_brother: "ob",
    younger_brother: "yb",
    older_sister: "os",
    younger_sister: "ys",
    son: "son",
    daughter: "dau",
    husband: "hub",
    wife: "wif",
  },

  // 爸爸
  f: {
    __name: { title: "爸爸/父亲", reverseM: "儿子", reverseF: "女儿" },
    father: "ff",
    mother: "fm",
    older_brother: "fob",
    younger_brother: "fyb",
    older_sister: "fos",
    younger_sister: "fys",
    son: "bro",
    daughter: "sis",
    wife: "m",
  },

  // 妈妈
  m: {
    __name: { title: "妈妈/母亲", reverseM: "儿子", reverseF: "女儿" },
    father: "mf",
    mother: "mm",
    older_brother: "mob",
    younger_brother: "myb",
    older_sister: "mos",
    younger_sister: "mys",
    son: "bro",
    daughter: "sis",
    husband: "f",
  },

  // 兄弟姐妹
  ob: {
    __name: { title: "哥哥", reverseM: "弟弟", reverseF: "妹妹" },
    son: "zhi_m",
    daughter: "zhi_f",
    wife: "saozi",
  },
  yb: {
    __name: { title: "弟弟", reverseM: "哥哥", reverseF: "姐姐" },
    son: "zhi_m",
    daughter: "zhi_f",
    wife: "dimei",
  },
  os: {
    __name: { title: "姐姐", reverseM: "弟弟", reverseF: "妹妹" },
    son: "wsheng_m",
    daughter: "wsheng_f",
    husband: "jiefu",
  },
  ys: {
    __name: { title: "妹妹", reverseM: "哥哥", reverseF: "姐姐" },
    son: "wsheng_m",
    daughter: "wsheng_f",
    husband: "meifu",
  },
  bro: {
    __name: { title: "兄弟", reverseM: "兄弟", reverseF: "姐妹" },
    son: "zhi_m",
    daughter: "zhi_f",
  },
  sis: {
    __name: { title: "姐妹", reverseM: "兄弟", reverseF: "姐妹" },
    son: "wsheng_m",
    daughter: "wsheng_f",
  },

  // 儿子/女儿
  son: {
    __name: { title: "儿子", reverseM: "爸爸", reverseF: "妈妈" },
    son: "sunzi",
    daughter: "sunnv",
    wife: "xifu",
  },
  dau: {
    __name: { title: "女儿", reverseM: "爸爸", reverseF: "妈妈" },
    son: "waisun_m",
    daughter: "waisun_f",
    husband: "nvxu",
  },

  // 配偶
  hub: {
    __name: { title: "丈夫/老公", reverseM: "", reverseF: "妻子/老婆" },
    father: "gonggong",
    mother: "popo",
    older_brother: "dabo",
    younger_brother: "xiaoshu",
    older_sister: "dagu",
    younger_sister: "xiaogu",
  },
  wif: {
    __name: { title: "妻子/老婆", reverseM: "丈夫/老公", reverseF: "" },
    father: "yuef",
    mother: "yuem",
    older_brother: "danajiu",
    younger_brother: "xiaojiu",
    older_sister: "dayizi",
    younger_sister: "xiaoyizi",
  },

  // 爷爷奶奶
  ff: {
    __name: { title: "爷爷/祖父", reverseM: "孙子", reverseF: "孙女" },
    father: "fff",
    mother: "ffm",
    son: "bo_shu",
    daughter: "guniang",
    wife: "fm",
  },
  fm: {
    __name: { title: "奶奶/祖母", reverseM: "孙子", reverseF: "孙女" },
    husband: "ff",
    son: "bo_shu",
    daughter: "guniang",
  },

  // 外公外婆
  mf: {
    __name: { title: "外公/外祖父", reverseM: "外孙", reverseF: "外孙女" },
    son: "jiu_shu",
    daughter: "yizi",
    wife: "mm",
  },
  mm: {
    __name: { title: "外婆/外祖母", reverseM: "外孙", reverseF: "外孙女" },
    husband: "mf",
    son: "jiu_shu",
    daughter: "yizi",
  },

  // 曾祖
  fff: {
    __name: { title: "曾祖父/太爷爷", reverseM: "曾孙", reverseF: "曾孙女" },
  },
  ffm: {
    __name: { title: "曾祖母/太奶奶", reverseM: "曾孙", reverseF: "曾孙女" },
  },

  // 父系叔伯姑
  fob: {
    __name: { title: "伯父/伯伯", reverseM: "侄子", reverseF: "侄女" },
    son: "tangxiong",
    daughter: "tangjie",
    wife: "bomu",
  },
  fyb: {
    __name: { title: "叔叔/叔父", reverseM: "侄子", reverseF: "侄女" },
    son: "tangdi",
    daughter: "tangmei",
    wife: "shenshen",
  },
  fos: {
    __name: { title: "姑妈/姑姑", reverseM: "侄子", reverseF: "侄女" },
    son: "biaogh",
    daughter: "biaojm",
    husband: "gufu",
  },
  fys: {
    __name: { title: "小姑/姑姑", reverseM: "侄子", reverseF: "侄女" },
    son: "biaogh",
    daughter: "biaojm",
    husband: "gufu",
  },
  bo_shu: {
    __name: { title: "伯父/叔叔", reverseM: "侄子", reverseF: "侄女" },
    son: "tangxd",
    daughter: "tangjm",
  },
  guniang: {
    __name: { title: "姑妈/姑姑", reverseM: "侄子", reverseF: "侄女" },
    son: "biaogh",
    daughter: "biaojm",
    husband: "gufu",
  },

  // 母系舅姨
  mob: {
    __name: { title: "大舅/舅舅", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_m",
    daughter: "biaoj_m",
    wife: "jiuma",
  },
  myb: {
    __name: { title: "小舅/舅舅", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_m",
    daughter: "biaoj_m",
    wife: "jiuma",
  },
  mos: {
    __name: { title: "大姨/姨妈", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_yi",
    daughter: "biaoj_yi",
    husband: "yifu",
  },
  mys: {
    __name: { title: "小姨/姨妈", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_yi",
    daughter: "biaoj_yi",
    husband: "yifu",
  },
  jiu_shu: {
    __name: { title: "舅舅", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_m",
    daughter: "biaoj_m",
    wife: "jiuma",
  },
  yizi: {
    __name: { title: "姨妈/阿姨", reverseM: "外甥", reverseF: "外甥女" },
    son: "biaog_yi",
    daughter: "biaoj_yi",
    husband: "yifu",
  },

  // 配偶的家人
  gonggong: {
    __name: { title: "公公/公爹", reverseM: "", reverseF: "儿媳" },
  },
  popo: {
    __name: { title: "婆婆/婆母", reverseM: "", reverseF: "儿媳" },
  },
  yuef: {
    __name: { title: "岳父/丈人", reverseM: "女婿", reverseF: "" },
  },
  yuem: {
    __name: { title: "岳母/丈母娘", reverseM: "女婿", reverseF: "" },
  },
  dabo: {
    __name: { title: "大伯子", reverseM: "", reverseF: "弟妹" },
  },
  xiaoshu: {
    __name: { title: "小叔子", reverseM: "", reverseF: "嫂子" },
  },
  dagu: {
    __name: { title: "大姑子", reverseM: "", reverseF: "弟妹" },
  },
  xiaogu: {
    __name: { title: "小姑子", reverseM: "", reverseF: "嫂子" },
  },
  danajiu: {
    __name: { title: "大舅子/内兄", reverseM: "妹夫", reverseF: "" },
  },
  xiaojiu: {
    __name: { title: "小舅子/内弟", reverseM: "姐夫", reverseF: "" },
  },
  dayizi: {
    __name: { title: "大姨子", reverseM: "妹夫", reverseF: "" },
  },
  xiaoyizi: {
    __name: { title: "小姨子", reverseM: "姐夫", reverseF: "" },
  },

  // 配偶称谓
  bomu: {
    __name: { title: "伯母", reverseM: "侄子", reverseF: "侄女" },
  },
  shenshen: {
    __name: { title: "婶婶/婶母", reverseM: "侄子", reverseF: "侄女" },
  },
  gufu: {
    __name: { title: "姑父/姑丈", reverseM: "侄子/外甥", reverseF: "侄女/外甥女" },
  },
  jiuma: {
    __name: { title: "舅妈/舅母", reverseM: "外甥", reverseF: "外甥女" },
  },
  yifu: {
    __name: { title: "姨父/姨丈", reverseM: "外甥", reverseF: "外甥女" },
  },
  saozi: {
    __name: { title: "嫂子/嫂嫂", reverseM: "小叔子", reverseF: "小姑子" },
  },
  dimei: {
    __name: { title: "弟妹/弟媳", reverseM: "哥哥", reverseF: "姐姐" },
  },
  jiefu: {
    __name: { title: "姐夫", reverseM: "小舅子", reverseF: "小姨子" },
  },
  meifu: {
    __name: { title: "妹夫", reverseM: "大舅子", reverseF: "大姨子" },
  },
  xifu: {
    __name: { title: "儿媳/媳妇", reverseM: "公公", reverseF: "婆婆" },
  },
  nvxu: {
    __name: { title: "女婿", reverseM: "岳父", reverseF: "岳母" },
  },

  // 侄子/侄女/外甥
  zhi_m: {
    __name: { title: "侄子", reverseM: "叔叔/伯伯", reverseF: "姑姑" },
    son: "zhi_sun",
    daughter: "zhi_sunnv",
  },
  zhi_f: {
    __name: { title: "侄女", reverseM: "叔叔/伯伯", reverseF: "姑姑" },
  },
  wsheng_m: {
    __name: { title: "外甥", reverseM: "舅舅", reverseF: "姨妈" },
  },
  wsheng_f: {
    __name: { title: "外甥女", reverseM: "舅舅", reverseF: "姨妈" },
  },

  // 孙辈
  sunzi: {
    __name: { title: "孙子", reverseM: "爷爷", reverseF: "奶奶" },
  },
  sunnv: {
    __name: { title: "孙女", reverseM: "爷爷", reverseF: "奶奶" },
  },
  waisun_m: {
    __name: { title: "外孙", reverseM: "外公", reverseF: "外婆" },
  },
  waisun_f: {
    __name: { title: "外孙女", reverseM: "外公", reverseF: "外婆" },
  },
  zhi_sun: {
    __name: { title: "侄孙", reverseM: "叔公/伯公", reverseF: "姑婆" },
  },
  zhi_sunnv: {
    __name: { title: "侄孙女", reverseM: "叔公/伯公", reverseF: "姑婆" },
  },

  // 堂兄弟姐妹
  tangxiong: {
    __name: { title: "堂哥", reverseM: "堂弟", reverseF: "堂妹" },
  },
  tangdi: {
    __name: { title: "堂弟", reverseM: "堂哥", reverseF: "堂姐" },
  },
  tangjie: {
    __name: { title: "堂姐", reverseM: "堂弟", reverseF: "堂妹" },
  },
  tangmei: {
    __name: { title: "堂妹", reverseM: "堂哥", reverseF: "堂姐" },
  },
  tangxd: {
    __name: { title: "堂兄弟", reverseM: "堂兄弟", reverseF: "堂姐妹" },
  },
  tangjm: {
    __name: { title: "堂姐妹", reverseM: "堂兄弟", reverseF: "堂姐妹" },
  },

  // 表兄弟姐妹（姑家）
  biaogh: {
    __name: { title: "表哥/表兄", reverseM: "表弟", reverseF: "表妹" },
  },
  biaojm: {
    __name: { title: "表姐/表妹", reverseM: "表哥/表弟", reverseF: "表姐/表妹" },
  },

  // 表兄弟姐妹（舅家）
  biaog_m: {
    __name: { title: "表哥/表弟", reverseM: "表哥/表弟", reverseF: "表姐/表妹" },
  },
  biaoj_m: {
    __name: { title: "表姐/表妹", reverseM: "表哥/表弟", reverseF: "表姐/表妹" },
  },

  // 表兄弟姐妹（姨家）
  biaog_yi: {
    __name: { title: "表哥/表弟", reverseM: "表哥/表弟", reverseF: "表姐/表妹" },
  },
  biaoj_yi: {
    __name: { title: "表姐/表妹", reverseM: "表哥/表弟", reverseF: "表姐/表妹" },
  },
};

const RELATION_BUTTONS = [
  { key: "father", label: "爸爸" },
  { key: "mother", label: "妈妈" },
  { key: "older_brother", label: "哥哥" },
  { key: "younger_brother", label: "弟弟" },
  { key: "older_sister", label: "姐姐" },
  { key: "younger_sister", label: "妹妹" },
  { key: "son", label: "儿子" },
  { key: "daughter", label: "女儿" },
  { key: "husband", label: "丈夫" },
  { key: "wife", label: "妻子" },
];

module.exports = {
  RELATION_MAP,
  RELATION_BUTTONS,
};
