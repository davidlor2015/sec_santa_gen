/****************************
 * CONFIG
 ****************************/
const ADMIN_PASSWORD = "family2024"; // change this if you want
const TEMP_PARTICIPANTS = [
  "Alyssa Tran",
  "Mia Huynh",
  "Vanessa",
  "Alianna",
  "Kristyanna",
];

/****************************
 * DOM Elements
 ****************************/
const adminToggle = document.getElementById("admin-toggle");
const adminLogin = document.getElementById("admin-login");
const adminEnter = document.getElementById("admin-enter");
const adminPass = document.getElementById("admin-pass");
const adminPanel = document.getElementById("admin-panel");
const adminLoginError = document.getElementById("admin-login-error");

const nameList = document.getElementById("name-list");
const generateBtn = document.getElementById("generate-btn");

const nameSelect = document.getElementById("name-select");
const revealBtn = document.getElementById("reveal-btn");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

/****************************
 * ADMIN MODE
 ****************************/
adminToggle.addEventListener("click", () => {
  adminLogin.classList.toggle("hidden");
});

adminEnter.addEventListener("click", () => {
  if (adminPass.value === ADMIN_PASSWORD) {
    adminLogin.classList.add("hidden");
    adminPanel.classList.remove("hidden");

    nameList.value = TEMP_PARTICIPANTS.join("\n");
  } else {
    adminLoginError.textContent = "Incorrect password.";
    adminLoginError.classList.remove("hidden");
  }
});

/****************************
 * GENERATE ASSIGNMENTS
 ****************************/
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateDerangement(names) {
  let receivers = [...names];
  let tries = 0;

  while (tries < 500) {
    shuffle(receivers);

    let valid = true;
    for (let i = 0; i < names.length; i++) {
      if (names[i] === receivers[i]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      const map = {};
      for (let i = 0; i < names.length; i++) {
        map[names[i]] = receivers[i];
      }
      return map;
    }

    tries++;
  }

  alert("Could not generate a valid Secret Santa list.");
  return null;
}

generateBtn.addEventListener("click", () => {
  const names = nameList.value
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n);

  if (names.length < 2) {
    alert("Need at least 2 participants.");
    return;
  }

  const assignments = generateDerangement(names);
  if (!assignments) return;

  const dataStr = JSON.stringify(assignments, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "assignments.json";
  link.click();

  alert("Download complete! Upload assignments.json to your GitHub repo.");
});

/****************************
 * PUBLIC REVEAL MODE
 ****************************/
fetch("assignments.json")
  .then((res) => res.json())
  .then((assignments) => {
    const names = Object.keys(assignments);
    names.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      nameSelect.appendChild(opt);
    });

    revealBtn.addEventListener("click", () => {
      errorEl.classList.add("hidden");
      resultEl.classList.add("hidden");

      const user = nameSelect.value;
      if (!user) {
        errorEl.textContent = "Please select your name.";
        errorEl.classList.remove("hidden");
        return;
      }

      const giftee = assignments[user];
      resultEl.textContent = `You are Secret Santa for: ${giftee}`;
      resultEl.classList.remove("hidden");
    });
  })
  .catch(() => {
    // assignments.json does not exist yet → admin hasn't uploaded it
  });
