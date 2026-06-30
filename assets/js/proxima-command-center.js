(function(){
  "use strict";
  const $ = (id) => document.getElementById(id);
  const commandInput = $("commandInput");
  const commandRunButton = $("commandRunButton");
  const commandStatus = $("commandStatus");
  const commandHelper = $("commandHelper");
  const activityFeed = $("activityFeed");
  const scannerInput = $("targetInput");
  const scanButton = $("scanButton");
  const riskLabel = $("riskLabel");

  if (!commandInput || !commandRunButton || !scannerInput || !scanButton) return;

  function stamp(){
    try { return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }
    catch(e){ return "Now"; }
  }

  function addActivity(message){
    if (!activityFeed) return;
    const li = document.createElement("li");
    const time = document.createElement("time");
    const span = document.createElement("span");
    time.textContent = stamp();
    span.textContent = message;
    li.append(time, span);
    activityFeed.prepend(li);
    while (activityFeed.children.length > 5) activityFeed.lastElementChild.remove();
  }

  function setStatus(text){
    if (commandStatus) commandStatus.textContent = text;
  }

  function extractTarget(command){
    const text = (command || "").trim();
    if (!text) return "";
    const scanPrefix = text.match(/^scan\s+(.+)/i);
    if (scanPrefix) return scanPrefix[1].trim();
    const urlMatch = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+|\b(?:\d{1,3}\.){3}\d{1,3}\b)/i);
    if (urlMatch) return urlMatch[0].trim();
    if (/review/i.test(text)) return "#review";
    if (/evidence|detail/i.test(text)) return "#evidence";
    if (/report|export/i.test(text)) return "#report";
    return text;
  }

  function scrollToId(id){
    const node = $(id);
    if (node) node.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function runCommand(raw){
    const command = (raw || commandInput.value || "").trim();
    if (!command) {
      setStatus("Need command");
      if (commandHelper) commandHelper.textContent = "Paste a link, IP, QR payload, suspicious message, or use one of the suggested commands.";
      addActivity("Command ignored because no input was provided.");
      return;
    }
    const target = extractTarget(command);
    if (target === "#review") {
      scrollToId("report");
      setStatus("Review mode");
      addActivity("Opened current findings for review.");
      return;
    }
    if (target === "#evidence") {
      scrollToId("scan-detail-workspace");
      setStatus("Evidence mode");
      addActivity("Opened evidence and scan details.");
      return;
    }
    if (target === "#report") {
      scrollToId("workflow");
      setStatus("Report mode");
      addActivity("Opened report and export actions.");
      return;
    }
    scannerInput.value = target;
    scannerInput.dispatchEvent(new Event("input", {bubbles:true}));
    setStatus("Scanning");
    addActivity("Scan started from Command Center.");
    scanButton.click();
    scrollToId("report");
  }

  commandRunButton.addEventListener("click", () => runCommand());
  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") runCommand();
  });

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.getAttribute("data-command") || "";
      commandInput.value = command;
      runCommand(command);
    });
  });

  const reviewButton = $("reviewFindingsButton");
  const evidenceButton = $("openEvidenceButton");
  if (reviewButton) reviewButton.addEventListener("click", () => runCommand("review findings"));
  if (evidenceButton) evidenceButton.addEventListener("click", () => runCommand("open evidence"));

  if (riskLabel && "MutationObserver" in window) {
    const observer = new MutationObserver(() => {
      const label = (riskLabel.textContent || "").trim();
      if (!label || /ready to scan/i.test(label)) return;
      setStatus("Result ready");
      addActivity("Result ready: " + label + ".");
    });
    observer.observe(riskLabel, {childList:true, subtree:true, characterData:true});
  }
})();
