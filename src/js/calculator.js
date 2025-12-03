export class Calculator {
  constructor(displayEl, exprEl) {
    this.displayEl = displayEl;
    this.exprEl = exprEl;
    this.resetAll();
  }

  resetAll() {
    this.displayValue = "0";
    this.previousValue = null;
    this.operator = null;
    this.waitingForNewValue = false;

    this.updateDisplay();
    this.updateExpression();
  }

  inputDigit(d) {
    if (this.waitingForNewValue) {
      this.displayValue = d === "." ? "0." : d;
      this.waitingForNewValue = false;
    } else {
      if (d === "." && this.displayValue.includes(".")) return;
      this.displayValue =
        this.displayValue === "0" && d !== "." ? d : this.displayValue + d;
    }
    this.updateDisplay();
  }

  handleOperator(op) {
    if (op === "%") {
      this.applyPercent();
      return;
    }

    if (this.operator && this.waitingForNewValue) {
      this.operator = op;
      this.updateExpression();
      return;
    }

    if (this.previousValue == null) {
      this.previousValue = parseFloat(this.displayValue);
    } else if (this.operator) {
      const result = this.calculate(
        this.previousValue,
        parseFloat(this.displayValue),
        this.operator
      );

      if (result === null) {
        this.resetAll();
        return;
      }

      this.previousValue = result;
      this.displayValue = String(this.formatNumber(result));
    }

    this.operator = op;
    this.waitingForNewValue = true;
    this.updateDisplay();
    this.updateExpression();
  }

  equals() {
    if (this.operator == null || this.previousValue == null) return;

    const result = this.calculate(
      this.previousValue,
      parseFloat(this.displayValue),
      this.operator
    );

    if (result === null) {
      this.resetAll();
      return;
    }

    this.displayValue = String(this.formatNumber(result));
    this.previousValue = null;
    this.operator = null;
    this.waitingForNewValue = false;

    this.updateExpression(true);
    this.updateDisplay();
  }

  calculate(a, b, op) {
    if (isNaN(a) || isNaN(b)) return 0;

    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? null : a / b;
      default:
        return b;
    }
  }

  applyPercent() {
    const val = parseFloat(this.displayValue);
    if (isNaN(val)) return;

    this.displayValue = String(this.formatNumber(val / 100));
    this.updateDisplay();
  }

  backspace() {
    if (this.waitingForNewValue) return;

    if (this.displayValue.length <= 1) {
      this.displayValue = "0";
    } else {
      this.displayValue = this.displayValue.slice(0, -1);
    }
    this.updateDisplay();
  }

  formatNumber(n) {
    if (Number.isInteger(n)) return n;
    return parseFloat(n.toFixed(10));
  }

  updateDisplay() {
    this.displayEl.textContent = this.displayValue;
    this.displayEl.setAttribute("data-value", this.displayValue);
  }

  updateExpression(force = false) {
    if (force) {
      this.exprEl.textContent = "";
      return;
    }

    let text = "";
    if (this.previousValue !== null) text += this.previousValue + " ";
    if (this.operator) text += this.operator;

    this.exprEl.textContent = text || "\u00A0";
  }
}
