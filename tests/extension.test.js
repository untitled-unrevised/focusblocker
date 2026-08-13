"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  domainsToRules,
  normalizeDomain,
  uniqueDomains
} = require("../extension/background.js");

test("normalizes domains without retaining paths or capitalization", () => {
  assert.equal(normalizeDomain(" HTTPS://Example.COM/path "), "example.com");
  assert.equal(normalizeDomain("sub.example.com"), "sub.example.com");
  assert.equal(normalizeDomain(""), "");
});

test("deduplicates and sorts configured domains", () => {
  assert.deepEqual(
    uniqueDomains(["z.example", "a.example", "Z.EXAMPLE"]),
    ["a.example", "z.example"]
  );
});

test("creates one main-frame redirect rule per domain", () => {
  const rules = domainsToRules(["example.com"]);
  assert.equal(rules.length, 1);
  assert.equal(rules[0].condition.urlFilter, "||example.com^");
  assert.deepEqual(rules[0].condition.resourceTypes, ["main_frame"]);
  assert.equal(rules[0].action.redirect.extensionPath, "/blocked.html");
});
