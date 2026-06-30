(function(){
  "use strict";
  const $ = (id) => document.getElementById(id);
  const riskLabel = $("riskLabel");
  const scoreValue = $("scoreValue");
  const signalCount = $("signalCount");
  const guidedNextAction = $("guidedNextAction");
  const summaryText = $("summaryText");
  const focusReadinessPill = $("focusReadinessPill");
  const focusResultText = $("focusResultText");
  const focusEvidenceText = $("focusEvidenceText");
  const focusReportText = $("focusReportText");
  const focusNextActionText = $("focusNextActionText");
  if (!focusNextActionText) return;

  function clean(node, fallback){
    return ((node && node.textContent) || fallback || "").replace(/\s+/g, " ").trim();
  }

  function isWaiting(label){
    return !label || /ready|waiting|not scanned/i.test(label);
  }

  function updateFocus(){
    const label = clean(riskLabel, "Ready");
    const score = clean(scoreValue, "--");
    const signals = clean(signalCount, "0");
    const next = clean(guidedNextAction, "Paste a target and run the local scan.");
    const summary = clean(summaryText, "");

    if (isWaiting(label)) {
      focusReadinessPill.textContent = "Awaiting scan";
      focusResultText.textContent = "Run a scan to see the current risk level, score, and signal count in one place.";
      focusEvidenceText.textContent = "Open supporting evidence only when the user needs the reason behind the verdict.";
      focusReportText.textContent = "Move from findings to exportable guidance when the review is ready.";
      focusNextActionText.textContent = "Paste a target and run the local scan.";
      return;
    }

    focusReadinessPill.textContent = "Focus ready";
    focusResultText.textContent = `Result: ${label} · Score ${score} · ${signals} local signal${signals === "1" ? "" : "s"}.`;
    focusEvidenceText.textContent = summary || "Evidence is available in the supporting details panel.";
    focusReportText.textContent = "Use the report tools after reviewing the highest-priority evidence.";
    focusNextActionText.textContent = next || "Review the result, then open evidence only if needed.";
  }

  function scrollToId(id){
    const node = $(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const review = $("focusReviewButton");
  const evidence = $("focusEvidenceButton");
  const report = $("focusReportButton");
  if (review) review.addEventListener("click", () => scrollToId("report"));
  if (evidence) evidence.addEventListener("click", () => scrollToId("scan-detail-workspace"));
  if (report) report.addEventListener("click", () => scrollToId("workflow"));

  const targets = [riskLabel, scoreValue, signalCount, guidedNextAction, summaryText].filter(Boolean);
  if ("MutationObserver" in window) {
    const observer = new MutationObserver(updateFocus);
    targets.forEach((target) => observer.observe(target, { childList: true, subtree: true, characterData: true }));
  }
  document.addEventListener("DOMContentLoaded", updateFocus);
  updateFocus();
})();
