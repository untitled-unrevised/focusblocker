"use strict";

const STORAGE_KEY = "blockedDomains";

function normalizeDomain(input) {
  const value = String(input || "").trim().toLowerCase();
  if (!value) return "";

  try {
    const candidate = value.includes("://") ? value : `https://${value}`;
    const hostname = new URL(candidate).hostname.replace(/^\.+|\.+$/g, "");
    if (!hostname || hostname.includes(" ")) return "";
    return hostname;
  } catch {
    return "";
  }
}

function uniqueDomains(values) {
  return [...new Set((values || []).map(normalizeDomain).filter(Boolean))].sort();
}

function domainsToRules(domains) {
  return uniqueDomains(domains).map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { extensionPath: "/blocked.html" }
    },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ["main_frame"]
    }
  }));
}

async function readDomains() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  return uniqueDomains(stored[STORAGE_KEY]);
}

async function refreshRules() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const addRules = domainsToRules(await readDomains());
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules
  });
}

if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(() => {
    refreshRules().catch(console.error);
  });

  chrome.runtime.onStartup.addListener(() => {
    refreshRules().catch(console.error);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes[STORAGE_KEY]) {
      refreshRules().catch(console.error);
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = { domainsToRules, normalizeDomain, uniqueDomains };
}
