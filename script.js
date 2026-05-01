// BytesTrade calculators
function byId(id) { return document.getElementById(id); }

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function setupMenu() {
  const button = byId("mobileMenuButton");
  const nav = byId("mainNav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    nav.classList.toggle("open");
    button.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
  });
}

function calculateLotSize() {
  const accountBalance = parseFloat(byId("accountBalance")?.value || 0);
  const riskPercent = parseFloat(byId("riskPercent")?.value || 0);
  const stopLossPips = parseFloat(byId("stopLossPips")?.value || 0);
  const pipValue = parseFloat(byId("pipValue")?.value || 10);

  const riskAmount = accountBalance * (riskPercent / 100);
  const lotSize = stopLossPips > 0 && pipValue > 0 ? riskAmount / (stopLossPips * pipValue) : 0;

  const lotResult = byId("lotResult");
  const riskAmountResult = byId("riskAmountResult");
  const microLotResult = byId("microLotResult");

  if (lotResult) lotResult.textContent = formatNumber(lotSize, 2);
  if (riskAmountResult) riskAmountResult.textContent = "$" + formatNumber(riskAmount, 2);
  if (microLotResult) microLotResult.textContent = formatNumber(lotSize * 100, 0) + " micro lots";
}

function calculateDrawdown() {
  const startingBalance = parseFloat(byId("startingBalance")?.value || 0);
  const currentBalance = parseFloat(byId("currentBalance")?.value || 0);
  const drawdownAmount = Math.max(startingBalance - currentBalance, 0);
  const drawdownPercent = startingBalance > 0 ? (drawdownAmount / startingBalance) * 100 : 0;
  const recoveryPercent = currentBalance > 0 ? (drawdownAmount / currentBalance) * 100 : 0;

  const ddPercent = byId("drawdownPercentResult");
  const ddAmount = byId("drawdownAmountResult");
  const recovery = byId("recoveryResult");

  if (ddPercent) ddPercent.textContent = formatNumber(drawdownPercent, 2) + "%";
  if (ddAmount) ddAmount.textContent = "$" + formatNumber(drawdownAmount, 2);
  if (recovery) recovery.textContent = formatNumber(recoveryPercent, 2) + "%";
}

function calculateRiskReward() {
  const entry = parseFloat(byId("entryPrice")?.value || 0);
  const stop = parseFloat(byId("stopLossPrice")?.value || 0);
  const target = parseFloat(byId("takeProfitPrice")?.value || 0);
  const direction = byId("tradeDirection")?.value || "long";

  let risk = 0;
  let reward = 0;

  if (direction === "long") {
    risk = Math.abs(entry - stop);
    reward = Math.abs(target - entry);
  } else {
    risk = Math.abs(stop - entry);
    reward = Math.abs(entry - target);
  }

  const ratio = risk > 0 ? reward / risk : 0;
  const breakevenWinRate = ratio > 0 ? 100 / (1 + ratio) : 0;

  const ratioResult = byId("riskRewardResult");
  const riskPipsResult = byId("riskPipsResult");
  const rewardPipsResult = byId("rewardPipsResult");
  const winRateResult = byId("winRateResult");

  if (ratioResult) ratioResult.textContent = "1:" + formatNumber(ratio, 2);
  if (riskPipsResult) riskPipsResult.textContent = formatNumber(risk, 5);
  if (rewardPipsResult) rewardPipsResult.textContent = formatNumber(reward, 5);
  if (winRateResult) winRateResult.textContent = formatNumber(breakevenWinRate, 2) + "%";
}

function wireCalculator(inputs, fn) {
  inputs.forEach(id => {
    const el = byId(id);
    if (el) {
      el.addEventListener("input", fn);
      el.addEventListener("change", fn);
    }
  });
  fn();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  wireCalculator(["accountBalance", "riskPercent", "stopLossPips", "pipValue"], calculateLotSize);
  wireCalculator(["startingBalance", "currentBalance"], calculateDrawdown);
  wireCalculator(["entryPrice", "stopLossPrice", "takeProfitPrice", "tradeDirection"], calculateRiskReward);
});
