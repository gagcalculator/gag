// === Fruits Data ===
const fruits = [
  { name: "Apple", category: "base", value: 20, image: "images/fruits/apple.png" },
  { name: "Carrot", category: "base", value: 15, image: "images/fruits/carrot.png" },
  { name: "Strawberry", category: "base", value: 15, image: "images/fruits/strawberry.png" },
  { name: "Nectarine", category: "bee", value: 48000, image: "images/fruits/nectarine.png" },
  { name: "Stonebite", category: "prehistoric", value: 35000, image: "images/fruits/stonebite.png" },
  { name: "Soul Fruit", category: "event", value: 7750, image: "images/fruits/soulfruit.png" },
  { name: "Cursed Fruit", category: "event", value: 25570, image: "images/fruits/cursedfruit.png" },
];

// === Mutations Data ===
const mutations = [
  { name: "Gold", multiplier: 20, group: "growth" },
  { name: "Rainbow", multiplier: 50, group: "growth" },
  { name: "Wet", multiplier: 2, group: "water" },
  { name: "Chilled", multiplier: 2, group: "cold" },
  { name: "Frozen", multiplier: 10, group: "cold" },
  { name: "Drenched", multiplier: 5, group: "water" },
  { name: "Burnt", multiplier: 4, group: "heat" },
  { name: "Cooked", multiplier: 10, group: "heat" },
  { name: "Clay", multiplier: 5, group: "earth" },
  { name: "Ceramic", multiplier: 30, group: "earth" },
  { name: "Sundried", multiplier: 85, group: "heat" },
  { name: "Verdant", multiplier: 5, group: "plant" },
  { name: "Paradisal", multiplier: 100, group: "plant" },
];

let selectedFruit = null;
let selectedMutations = [];

function renderFruits(filter = "all") {
  const grid = document.getElementById("fruitGrid");
  grid.innerHTML = "";

  fruits
    .filter(fruit => filter === "all" || fruit.category === filter)
    .forEach(fruit => {
      const div = document.createElement("div");
      div.className = "fruit-item";
      div.onclick = () => selectFruit(fruit.name);
      if (selectedFruit === fruit.name) div.classList.add("selected");
      div.innerHTML = `<img src="${fruit.image}" alt="${fruit.name}" /><span>${fruit.name}</span>`;
      grid.appendChild(div);
    });
}

function selectFruit(name) {
  selectedFruit = name;
  renderFruits();
}

function renderMutations() {
  const container = document.getElementById("mutationContainer");
  container.innerHTML = "";
  mutations.forEach(mutation => {
    const btn = document.createElement("button");
    btn.innerText = mutation.name;
    btn.className = "mutation-btn";
    if (selectedMutations.includes(mutation.name)) btn.classList.add("active");
    if (!canSelectMutation(mutation)) btn.classList.add("disabled");
    btn.onclick = () => toggleMutation(mutation.name);
    container.appendChild(btn);
  });
}

function toggleMutation(name) {
  if (selectedMutations.includes(name)) {
    selectedMutations = selectedMutations.filter(m => m !== name);
  } else {
    const mutation = mutations.find(m => m.name === name);
    if (canSelectMutation(mutation)) {
      selectedMutations.push(name);
    }
  }
  renderMutations();
}

function canSelectMutation(mutation) {
  const selectedGroups = selectedMutations.map(name => {
    const m = mutations.find(m => m.name === name);
    return m?.group;
  });

  // Growth: Only one (Gold or Rainbow)
  if (mutation.group === "growth" && selectedGroups.includes("growth")) return false;

  // Water + Cold/Frozen conflict
  if (mutation.group === "cold" && selectedGroups.includes("water")) return false;
  if (mutation.group === "water" && selectedGroups.includes("cold")) return false;

  // Heat conflicts
  if (mutation.name === "Burnt" && selectedMutations.includes("Cooked")) return false;
  if (mutation.name === "Cooked" && selectedMutations.includes("Burnt")) return false;

  // Clay vs Ceramic
  if (mutation.name === "Clay" && selectedMutations.includes("Ceramic")) return false;
  if (mutation.name === "Ceramic" && selectedMutations.includes("Clay")) return false;

  // Verdant + Sundried -> Paradisal (can't co-exist)
  if ((mutation.name === "Verdant" || mutation.name === "Sundried") && selectedMutations.includes("Paradisal")) return false;
  if (mutation.name === "Paradisal" && (selectedMutations.includes("Verdant") || selectedMutations.includes("Sundried"))) return false;

  return true;
}

function filterFruits(cat) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderFruits(cat);
}

function calculate() {
  const weight = parseFloat(document.getElementById("weight").value);
  if (!selectedFruit) return alert("Please select a fruit!");
  if (isNaN(weight)) return alert("Enter valid weight!");

  const fruit = fruits.find(f => f.name === selectedFruit);

  let mutationBonus = 0;
  selectedMutations.forEach(name => {
    const m = mutations.find(m => m.name === name);
    if (m) mutationBonus += m.multiplier;
  });

  const base = fruit.value * weight;
  const value = base * (1 + mutationBonus);

  document.getElementById("result").innerText = `🍇 ${fruit.name} Value: $${value.toFixed(2)}`;
}

// On load
renderFruits();
renderMutations();
