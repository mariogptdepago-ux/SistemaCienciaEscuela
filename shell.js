(() => {
"use strict";

const $ = id => document.getElementById(id);
const cfg = window.APP_SPACING_CONFIG || {};
const rawUrl = String(cfg.appsScriptUrl || "").trim();

function hideAllScreens() {
  ["localBlock","setupNeeded","loading","errorScreen"].forEach(id => $(id)?.classList.add("hidden"));
}

function showOnly(id) {
  hideAllScreens();
  $("systemFrame")?.classList.add("hidden");
  $(id)?.classList.remove("hidden");
}

function isConfigured(url) {
  return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:[?#].*)?$/i.test(url);
}

function installDeterrents() {
  document.addEventListener("contextmenu", e => e.preventDefault(), true);
  document.addEventListener("keydown", e => {
    const k = String(e.key || "").toLowerCase();
    const blocked =
      k === "f12" ||
      (e.shiftKey && k === "f10") ||
      (e.ctrlKey && ["u","s"].includes(k)) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c","k"].includes(k));
    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

function openSystem() {
  if (location.protocol === "file:") {
    showOnly("localBlock");
    return;
  }

  if (!isConfigured(rawUrl)) {
    showOnly("setupNeeded");
    return;
  }

  const frame = $("systemFrame");
  let completed = false;

  const timeout = setTimeout(() => {
    if (completed) return;
    $("errorText").textContent =
      "La aplicación de Google Apps Script tardó demasiado en responder. Verifica que la URL de config.js termine en /exec y que el despliegue esté activo.";
    showOnly("errorScreen");
  }, 20000);

  frame.addEventListener("load", () => {
    completed = true;
    clearTimeout(timeout);
    hideAllScreens();
    frame.classList.remove("hidden");
  }, {once:true});

  frame.src = rawUrl;
}

installDeterrents();
$("retryBtn")?.addEventListener("click", () => location.reload());
openSystem();
})();