let codes = {};
let assignments = {};

async function loadData() {
  try {
    const codesRes = await fetch("codes.json");
    const assignmentsRes = await fetch("assignments.json");

    codes = await codesRes.json();
    assignments = await assignmentsRes.json();
  } catch (err) {
    console.error("Error loading JSON files:", err);
  }
}

loadData();

const codeInput = document.getElementById("code-input");
const revealBtn = document.getElementById("reveal-btn");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");

revealBtn.addEventListener("click", () => {
  errorEl.classList.add("hidden");
  resultEl.classList.add("hidden");

  const code = codeInput.value.trim();

  if (!code) {
    showError("Please enter your code.");
    return;
  }

  const name = codes[code];
  if (!name) {
    showError("Invalid or expired code.");
    return;
  }

  const giftee = assignments[name];

  if (!giftee) {
    showError("No assignment found for this code.");
    return;
  }

  // Show result
  resultEl.textContent = `You are Secret Santa for: ${giftee}`;
  resultEl.classList.remove("hidden");

  // Remove code locally (prevents reuse during the same session)
  delete codes[code];
});

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}
