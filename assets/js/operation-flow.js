(function(){
  "use strict";
  const $ = (id) => document.getElementById(id);
  const nodes = Array.from(document.querySelectorAll("[data-flow-node]"));
  const flowStatePill = $("flowStatePill");
  const flowRiskLevel = $("flowRiskLevel");
  const flowRiskScore = $("flowRiskScore");
  const flowSignalCount = $("flowSignalCount");
  const flowNextShort = $("flowNextShort");
  const flowRecommendedText = $("flowRecommendedText");
  const riskLabel = $("riskLabel");
  const scoreValue = $("scoreValue");
  const signalCount = $("signalCount");
  const guidedNextAction = $("guidedNextAction");
  const summaryText = $("summaryText");
  const scanButton = $("scanButton");
  const commandRunButton = $("commandRunButton");

  if (!nodes.length || !flowRiskLevel) return;

  const order = ["command", "scan", "result", "evidence", "action"];

  function setStage(stage){
    const activeIndex = Math.max(0, order.indexOf(stage));
    nodes.forEach((node) => {
      const nodeIndex = order.indexOf(node.getAttribute("data-flow-node"));
      node.classList.toggle("active", nodeIndex === activeIndex);
      node.classList.toggle("complete", nodeIndex > -1 && nodeIndex < activeIndex);
    });
  }

  function shortNext(text){
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "Review result";
    if (clean.length <= 34) return clean;
    return clean.slice(0, 31).trim() + "…";
  }

  function readRiskState(){
    const label = (riskLabel && riskLabel.textContent || "Ready").trim();
    const score = (scoreValue && scoreValue.textContent || "--").trim();
    const signals = (signalCount && signalCount.textContent || "0").trim();
    const next = (guidedNextAction && guidedNextAction.textContent || "Scan first").trim();
    const summary = (summaryText && summaryText.textContent || "").trim();
    return { label, score, signals, next, summary };
  }

  function updateFlow(){
    const state = readRiskState();
    const ready = !state.label || /ready to scan/i.test(state.label);
    flowRiskLevel.textContent = ready ? "Ready" : state.label;
    flowRiskScore.textContent = state.score || "--";
    flowSignalCount.textContent = state.signals || "0";
    flowNextShort.textContent = shortNext(state.next);

    if (ready) {
      setStage("command");
      if (flowStatePill) flowStatePill.textContent = "Waiting for scan";
      if (flowRecommendedText) flowRecommendedText.textContent = "Paste a target and run a local scan.";
      return;
    }

    setStage("result");
    if (flowStatePill) flowStatePill.textContent = "Result ready";
    if (flowRecommendedText) flowRecommendedText.textContent = state.next || state.summary || "Review the result, then open evidence only if needed.";
  }

  function scrollToId(id){
    const node = $(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (scanButton) scanButton.addEventListener("click", () => {
    setStage("scan");
    if (flowStatePill) flowStatePill.textContent = "Scanning";
    window.setTimeout(updateFlow, 350);
  });

  if (commandRunButton) commandRunButton.addEventListener("click", () => {
    setStage("scan");
    if (flowStatePill) flowStatePill.textContent = "Command running";
  });

  const reviewButton = $("flowReviewButton");
  const evidenceButton = $("flowEvidenceButton");
  const exportButton = $("flowExportButton");
  if (reviewButton) reviewButton.addEventListener("click", () => { setStage("result"); scrollToId("report"); });
  if (evidenceButton) evidenceButton.addEventListener("click", () => { setStage("evidence"); scrollToId("scan-detail-workspace"); });
  if (exportButton) exportButton.addEventListener("click", () => { setStage("action"); scrollToId("workflow"); });

  const targets = [riskLabel, scoreValue, signalCount, guidedNextAction, summaryText].filter(Boolean);
  if ("MutationObserver" in window) {
    const observer = new MutationObserver(updateFlow);
    targets.forEach((target) => observer.observe(target, { childList: true, subtree: true, characterData: true }));
  }

  document.addEventListener("DOMContentLoaded", updateFlow);
  updateFlow();
})();
