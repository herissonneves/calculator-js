export class Converter {
  constructor(opts) {
    this.selectCategory = opts.selectCategory;
    this.fromSelect = opts.fromSelect;
    this.toSelect = opts.toSelect;
    this.inputEl = opts.inputEl;
    this.resultEl = opts.resultEl;
    this.noteEl = opts.noteEl;

    this.categories = {
      distance: {
        units: {
          m: {label: "Meters", toBase: v => v, fromBase: v => v},
          km: {label: "Kilometers", toBase: v => v * 1000, fromBase: v => v / 1000},
          cm: {label: "Centimeters", toBase: v => v / 100, fromBase: v => v * 100},
          mm: {label: "Millimeters", toBase: v => v / 1000, fromBase: v => v * 1000}
        },
        note: "Distance units"
      },

      weight: {
        units: {
          g: {label: "Grams", toBase: v => v, fromBase: v => v},
          kg: {label: "Kilograms", toBase: v => v * 1000, fromBase: v => v / 1000},
          lb: {label: "Pounds", toBase: v => v * 453.59237, fromBase: v => v / 453.59237}
        },
        note: "Weight units"
      },

      temperature: {
        units: {
          C: {label: "Celsius", toBase: v => v, fromBase: v => v},
          F: {label: "Fahrenheit", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32},
          K: {label: "Kelvin", toBase: v => v - 273.15, fromBase: v => v + 273.15}
        },
        note: "Temperature units"
      }
    };

    this.init();
  }

  init() {
    this.selectCategory.addEventListener("change", () => this.populateUnits());
    this.populateUnits();
  }

  populateUnits() {
    const cat = this.selectCategory.value;
    const cfg = this.categories[cat];

    this.fromSelect.innerHTML = "";
    this.toSelect.innerHTML = "";

    Object.keys(cfg.units).forEach(key => {
      const opt1 = document.createElement("option");
      opt1.value = key;
      opt1.textContent = `${cfg.units[key].label} (${key})`;
      this.fromSelect.appendChild(opt1);

      const opt2 = opt1.cloneNode(true);
      this.toSelect.appendChild(opt2);
    });

    this.fromSelect.selectedIndex = 0;
    this.toSelect.selectedIndex = 1 < this.toSelect.options.length ? 1 : 0;

    this.noteEl.textContent = cfg.note;

    this.updateResult();
  }

  convert() {
    const cat = this.selectCategory.value;
    const cfg = this.categories[cat];

    const from = this.fromSelect.value;
    const to = this.toSelect.value;

    let val = this.inputEl.value.trim();
    if (val === "") {
      this.resultEl.textContent = "—";
      return;
    }

    val = Number(val.replace(",", "."));
    if (Number.isNaN(val)) {
      this.resultEl.textContent = "Invalid input";
      return;
    }

    const inBase = cfg.units[from].toBase(val);
    const out = cfg.units[to].fromBase(inBase);

    this.resultEl.textContent = `${this.format(out)} ${to}`;
  }

  updateResult() {
    try {
      this.convert();
    } catch (e) {
      this.resultEl.textContent = "Error";
    }
  }

  format(n) {
    if (Number.isInteger(n)) return String(n);
    return parseFloat(n.toFixed(8));
  }
}
