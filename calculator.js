// calculator.js — handles stat prediction and comparison

let characters = {};
let classes = {};

async function loadData() {
  const charRes = await fetch("characters.json");
  characters = await charRes.json();
  const classRes = await fetch("classes.json");
  classes = await classRes.json();
  populateCharacters();
}
loadData();

function populateCharacters() {
  const select = document.getElementById("characterSelect");
  Object.keys(characters).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
  // also build stat input fields for comparison
  buildStatInputs(Object.keys(characters)[0]);
}

function buildStatInputs(name) {
  const container = document.getElementById("statInputs");
  container.innerHTML = "";
  const stats = characters[name].baseStats;

  for (let stat in stats) {
    // wrapper div for each stat
    const field = document.createElement("div");
    field.className = "stat-field";

    const label = document.createElement("label");
    label.textContent = stat;

    const input = document.createElement("input");
    input.type = "number";
    input.id = `input-${stat}`;
    input.value = stats[stat];

    field.appendChild(label);
    field.appendChild(input);
    container.appendChild(field);
  }
}

function calculateStats(name, level, classPath) {
  const char = characters[name];
  let stats = { ...char.baseStats };
  let growths = { ...char.growthRates };

  // Apply class growths after level 10
  classPath.forEach((cls, idx) => {
    if (idx > 0) { // assume first class is pre-10
      const mod = classes[cls]?.growthRates || {};
      for (let stat in growths) {
        growths[stat] += (mod[stat] || 0);
      }
    }
  });

  for (let i = 2; i <= level; i++) {
    for (let stat in stats) {
      stats[stat] += growths[stat] / 100; // expected value
    }
  }
  return stats;
}

function showResults(stats) {
  const div = document.getElementById("results");
  div.innerHTML = "<h3>Predicted Stats</h3>";
  for (let stat in stats) {
    div.innerHTML += `${stat}: ${stats[stat].toFixed(0)}<br>`;
  }
}

function compareStats(predicted) {
  const div = document.getElementById("results");
  div.innerHTML += "<h3>Comparison</h3>";
  for (let stat in predicted) {
    const actual = parseInt(document.getElementById(`input-${stat}`).value);
    const diff = actual - predicted[stat];
    let grade = "";
    if (diff > 2) grade = "Lucky!";
    else if (diff < -2) grade = "Unlucky!";
    else grade = "Average";
    div.innerHTML += `${stat}: Actual ${actual}, Expected ${predicted[stat].toFixed(0)} → ${grade}<br>`;
  }
}

document.getElementById("characterSelect").addEventListener("change", e => {
  buildStatInputs(e.target.value);
});

document.getElementById("calculateBtn").addEventListener("click", () => {
  const name = document.getElementById("characterSelect").value;
  const level = parseInt(document.getElementById("levelInput").value);
  const classPath = document.getElementById("classPath").value.split(",").map(s => s.trim());
  const stats = calculateStats(name, level, classPath);
  showResults(stats);
});

document.getElementById("compareBtn").addEventListener("click", () => {
  const name = document.getElementById("characterSelect").value;
  const level = parseInt(document.getElementById("levelInput").value);
  const classPath = document.getElementById("classPath").value.split(",").map(s => s.trim());
  const predicted = calculateStats(name, level, classPath);
  compareStats(predicted);
});

populateCharacters();