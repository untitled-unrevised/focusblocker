"use strict";

document.querySelector("#back").addEventListener("click", () => {
  if (history.length > 1) history.back();
  else location.href = "about:blank";
});
