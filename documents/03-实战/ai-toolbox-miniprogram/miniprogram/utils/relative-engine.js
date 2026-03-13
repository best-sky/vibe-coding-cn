/**
 * 亲戚关系计算引擎
 * 根据关系链逐步推导最终称谓
 */

const { RELATION_MAP } = require("./relative-data");

function resolveRelation(chain) {
  if (!chain || chain.length === 0) {
    return { found: false, title: "", reverseM: "", reverseF: "" };
  }

  let currentKey = "me";

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i];
    const node = RELATION_MAP[currentKey];
    if (!node) {
      return { found: false, title: "关系较远，无常用称谓", reverseM: "", reverseF: "" };
    }

    const nextKey = node[step];
    if (!nextKey) {
      return { found: false, title: "关系较远，无常用称谓", reverseM: "", reverseF: "" };
    }

    currentKey = nextKey;
  }

  const result = RELATION_MAP[currentKey];
  if (!result || !result.__name) {
    return { found: false, title: "关系较远，无常用称谓", reverseM: "", reverseF: "" };
  }

  return {
    found: true,
    title: result.__name.title,
    reverseM: result.__name.reverseM,
    reverseF: result.__name.reverseF,
  };
}

function getAvailableRelations(chain) {
  if (!chain || chain.length === 0) {
    const meNode = RELATION_MAP["me"];
    return Object.keys(meNode).filter((k) => k !== "__name");
  }

  let currentKey = "me";
  for (let i = 0; i < chain.length; i++) {
    const node = RELATION_MAP[currentKey];
    if (!node) return [];
    const nextKey = node[chain[i]];
    if (!nextKey) return [];
    currentKey = nextKey;
  }

  const node = RELATION_MAP[currentKey];
  if (!node) return [];
  return Object.keys(node).filter((k) => k !== "__name");
}

module.exports = {
  resolveRelation,
  getAvailableRelations,
};
