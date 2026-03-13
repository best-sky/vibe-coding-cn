/**
 * 个人所得税计算器
 * 基于2024年最新税率表（7级超额累进税率）
 * 支持累计预扣法（月薪）和年终奖单独计税
 */

const TAX_BRACKETS = [
  { upper: 36000, rate: 0.03, deduction: 0 },
  { upper: 144000, rate: 0.10, deduction: 2520 },
  { upper: 300000, rate: 0.20, deduction: 16920 },
  { upper: 420000, rate: 0.25, deduction: 31920 },
  { upper: 660000, rate: 0.30, deduction: 52920 },
  { upper: 960000, rate: 0.35, deduction: 85920 },
  { upper: Infinity, rate: 0.45, deduction: 181920 },
];

const BONUS_BRACKETS = [
  { upper: 3000, rate: 0.03, deduction: 0 },
  { upper: 12000, rate: 0.10, deduction: 210 },
  { upper: 25000, rate: 0.20, deduction: 1410 },
  { upper: 35000, rate: 0.25, deduction: 2660 },
  { upper: 55000, rate: 0.30, deduction: 4410 },
  { upper: 80000, rate: 0.35, deduction: 7160 },
  { upper: Infinity, rate: 0.45, deduction: 15160 },
];

const THRESHOLD = 5000;

const SPECIAL_DEDUCTION_ITEMS = [
  { key: "child_edu", label: "子女教育", amount: 2000 },
  { key: "continue_edu", label: "继续教育", amount: 400 },
  { key: "serious_illness", label: "大病医疗", amount: 0 },
  { key: "housing_loan", label: "住房贷款利息", amount: 1000 },
  { key: "housing_rent", label: "住房租金", amount: 1500 },
  { key: "support_elderly", label: "赡养老人", amount: 3000 },
  { key: "baby_care", label: "3岁以下婴幼儿照护", amount: 2000 },
];

const INSURANCE_DEFAULTS = {
  pension: 0.08,
  medical: 0.02,
  unemployment: 0.005,
  housingFund: 0.07,
};

function findBracket(amount, brackets) {
  for (let i = 0; i < brackets.length; i++) {
    if (amount <= brackets[i].upper) return brackets[i];
  }
  return brackets[brackets.length - 1];
}

function fmt(n) {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function calcInsurance(salary, rates) {
  const pension = salary * (rates.pension || 0);
  const medical = salary * (rates.medical || 0);
  const unemployment = salary * (rates.unemployment || 0);
  const housingFund = salary * (rates.housingFund || 0);
  const total = pension + medical + unemployment + housingFund;
  return {
    pension: fmt(pension),
    medical: fmt(medical),
    unemployment: fmt(unemployment),
    housingFund: fmt(housingFund),
    total: Math.round(total * 100) / 100,
    totalDisplay: fmt(total),
  };
}

function calcMonthlyTax(monthlySalary, insuranceRates, specialDeductions) {
  const insurance = calcInsurance(monthlySalary, insuranceRates);
  const monthlySpecial = specialDeductions.reduce((sum, key) => {
    const item = SPECIAL_DEDUCTION_ITEMS.find((i) => i.key === key);
    return sum + (item ? item.amount : 0);
  }, 0);

  const months = [];
  let prevCumulativeTax = 0;

  for (let m = 1; m <= 12; m++) {
    const cumulativeIncome = monthlySalary * m;
    const cumulativeInsurance = insurance.total * m;
    const cumulativeThreshold = THRESHOLD * m;
    const cumulativeSpecial = monthlySpecial * m;

    const taxableIncome = Math.max(
      0,
      cumulativeIncome - cumulativeInsurance - cumulativeThreshold - cumulativeSpecial
    );

    const bracket = findBracket(taxableIncome, TAX_BRACKETS);
    const cumulativeTax = Math.max(
      0,
      Math.round((taxableIncome * bracket.rate - bracket.deduction) * 100) / 100
    );
    const monthTax = Math.round((cumulativeTax - prevCumulativeTax) * 100) / 100;
    const takeHome = Math.round((monthlySalary - insurance.total - monthTax) * 100) / 100;

    months.push({
      month: m,
      salary: monthlySalary,
      insurance: insurance.total,
      threshold: THRESHOLD,
      specialDeduction: monthlySpecial,
      taxableIncome: fmt(taxableIncome),
      rate: bracket.rate,
      ratePercent: (bracket.rate * 100).toFixed(0),
      deduction: bracket.deduction,
      cumulativeTax: fmt(cumulativeTax),
      monthTax,
      monthTaxDisplay: fmt(monthTax),
      takeHome,
      takeHomeDisplay: fmt(takeHome),
    });

    prevCumulativeTax = cumulativeTax;
  }

  const yearTax = months.reduce((s, m) => s + m.monthTax, 0);
  const yearTakeHome = months.reduce((s, m) => s + m.takeHome, 0);

  return {
    monthlySalary,
    insurance,
    monthlySpecial,
    months,
    yearTax: fmt(yearTax),
    yearTakeHome: fmt(yearTakeHome),
    yearInsurance: fmt(insurance.total * 12),
  };
}

function calcBonusTax(bonus) {
  const monthlyAvg = bonus / 12;
  const bracket = findBracket(monthlyAvg, BONUS_BRACKETS);
  const tax = Math.max(0, Math.round((bonus * bracket.rate - bracket.deduction) * 100) / 100);
  const afterTax = Math.round((bonus - tax) * 100) / 100;
  return {
    bonus: fmt(bonus),
    monthlyAvg: fmt(monthlyAvg),
    rate: bracket.rate,
    ratePercent: (bracket.rate * 100).toFixed(0),
    deduction: fmt(bracket.deduction),
    tax: fmt(tax),
    afterTax: fmt(afterTax),
  };
}

module.exports = {
  TAX_BRACKETS,
  BONUS_BRACKETS,
  THRESHOLD,
  SPECIAL_DEDUCTION_ITEMS,
  INSURANCE_DEFAULTS,
  calcInsurance,
  calcMonthlyTax,
  calcBonusTax,
};
