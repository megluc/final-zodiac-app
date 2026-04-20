import { loadAppData } from "./api.js";
import { state, getBigThree, getCompatibility } from "./state.js";
import { renderApp, renderBigThree, renderCompatibility } from "./render.js";
import * as dom from "./dom.js";

// ---------------------------------------------------------------------------
// Load sequence
// ---------------------------------------------------------------------------

/**
 * Kicks off (or retries) the full data-load sequence.
 * Sets the loading state, triggers a render, awaits the load, then renders
 * again with whatever state api.js has written (success or error).
 */
async function startLoad() {
  state.loadStatus = "loading";
  renderApp({ onRetry: startLoad });

  await loadAppData();

  // api.js has already written state.loadStatus / state.errorMessage / data.
  renderApp({ onRetry: startLoad });
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

dom.favoritesBtn?.addEventListener("click", () => {
  state.query = "";
  state.showFavorites = !state.showFavorites;
  renderApp();
});  
  

dom.searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  state.showFavorites = false;
  renderApp();
});

dom.bigThreeBtn?.addEventListener("click", () => {
  const month = parseInt(dom.monthInput.value, 10);
  const day   = parseInt(dom.dayInput.value, 10);
  const hour  = parseInt(dom.hourInput.value, 10);

  if (isNaN(month) || isNaN(day) || isNaN(hour)) {
    dom.bigThreeBox.textContent = "Please enter valid numbers for month, day, and hour.";
    return;
  }

  if (month < 1 || month > 12) {
    dom.bigThreeBox.textContent = "Month must be between 1 and 12.";
    return;
  }
  if (day < 1 || day > 31) {
    dom.bigThreeBox.textContent = "Day must be between 1 and 31.";
    return;
  }
  if (hour < 0 || hour > 23) {
    dom.bigThreeBox.textContent = "Hour must be between 0 and 23.";
    return;
  }

  renderBigThree(getBigThree(month, day, hour));
});

dom.compatBtn?.addEventListener("click", () => {
  const sign1 = dom.sign1Select.value;
  const sign2 = dom.sign2Select.value;

  if (!sign1 || !sign2) {
    dom.compatBox.textContent = "Please select two signs to compare.";
    return;
  }

  if (sign1 === sign2) {
    dom.compatBox.textContent = "Please select two different signs to compare.";
    return;
  }

  const data = getCompatibility(sign1, sign2);
  if (!data) {
    dom.compatBox.textContent = "No compatibility data found for these signs.";
    return;
  }

  renderCompatibility(sign1, sign2, data);
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

startLoad();
