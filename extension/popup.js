"use strict";

const STORAGE_KEY = "blockedDomains";
const form = document.querySelector("#add-form");
const input = document.querySelector("#domain");
const list = document.querySelector("#domains");
const empty = document.querySelector("#empty");

function normalizeDomain(value) {
  try {
    const text = String(value || "").trim().toLowerCase();
    const candidate = text.includes("://") ? text : `https://${text}`;
    return new URL(candidate).hostname.replace(/^\.+|\.+$/g, "");
  } catch {
    return "";
  }
}

async function getDomains() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  return Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY] : [];
}

async function saveDomains(domains) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: [...new Set(domains)].sort()
  });
}

async function render() {
  const domains = await getDomains();
  list.replaceChildren();
  empty.hidden = domains.length > 0;

  for (const domain of domains) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const remove = document.createElement("button");
    label.textContent = domain;
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${domain}`);
    remove.addEventListener("click", async () => {
      await saveDomains((await getDomains()).filter((entry) => entry !== domain));
      await render();
    });
    item.append(label, remove);
    list.append(item);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const domain = normalizeDomain(input.value);
  if (!domain) {
    input.setCustomValidity("Enter a valid domain.");
    input.reportValidity();
    return;
  }

  input.setCustomValidity("");
  await saveDomains([...(await getDomains()), domain]);
  input.value = "";
  await render();
});

input.addEventListener("input", () => input.setCustomValidity(""));
render();
