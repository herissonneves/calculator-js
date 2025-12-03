import {Calculator} from "./calculator.js";
import {Converter} from "./converter.js";

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

/* ---------- Toast helper ---------- */
function toast(msg, timeout = 2000) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");

  clearTimeout(t._hide);
  t._hide = setTimeout(() => t.classList.remove("show"), timeout);
}

/* ---------- Calculator Setup ---------- */
const displayValueEl = $("#display-value");
const displayExprEl = $("#display-expression");

const calc = new Calculator(displayValueEl, displayExprEl);

function handleAction(action, value) {
  switch (action) {
    case "digit":
      calc.inputDigit(value);
      break;
    case "operator":
      calc.handleOperator(value);
      break;
    case "equals":
      calc.equals();
      break;
    case "clear":
      calc.resetAll();
      break;
    case "backspace":
      calc.backspace();
      break;
    case "percent":
      calc.applyPercent();
      break;
  }
}

/* Clicks */
$("#keypad").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  handleAction(btn.dataset.action, btn.dataset.value);
});

/* Keyboard */
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/^[0-9]$/.test(key) || key === ".") {
    e.preventDefault();
    handleAction("digit", key);
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    e.preventDefault();
    handleAction("operator", key);
    return;
  }

  if (key === "Enter") {
    e.preventDefault();
    handleAction("equals");
    return;
  }

  if (key === "Backspace") {
    e.preventDefault();
    handleAction("backspace");
    return;
  }

  if (key === "Escape") {
    e.preventDefault();
    handleAction("clear");
    return;
  }

  if (key === "%") {
    e.preventDefault();
    handleAction("percent");
    return;
  }
});

/* ---------- Converter Setup ---------- */
const converter = new Converter({
  selectCategory: $("#category"),
  fromSelect: $("#from-unit"),
  toSelect: $("#to-unit"),
  inputEl: $("#convert-input"),
  resultEl: $("#convert-result"),
  noteEl: $("#convert-note")
});

let autoMode = true;

$("#convert-btn").addEventListener("click", () =>
  converter.convert()
);

$("#from-unit").addEventListener("change", () =>
  converter.updateResult()
);

$("#to-unit").addEventListener("change", () =>
  converter.updateResult()
);

$("#convert-input").addEventListener("input", () => {
  if (autoMode) converter.updateResult();
});

/* Auto toggle */
const autoBtn = $("#auto-toggle");

function updateAutoUI() {
  autoBtn.textContent = autoMode ? "Auto: On" : "Auto: Off";
  autoBtn.classList.toggle("active", autoMode);
}

autoBtn.addEventListener("click", () => {
  autoMode = !autoMode;
  updateAutoUI();
});

updateAutoUI();

/* Copy result */
$("#copy-result").addEventListener("click", async () => {
  const text = $("#convert-result").textContent;
  try {
    await navigator.clipboard.writeText(text);
    toast("Result copied");
  } catch (e) {
    toast("Unable to copy");
  }
});

/* Prevent text selection in keypad */
$("#keypad").addEventListener("mousedown", (e) => e.preventDefault());

/* Initial convert */
converter.updateResult();
