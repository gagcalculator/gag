const fruits = [
  { name: "Apple", category: "base", value: 20, image: "images/fruits/apple.png" },
  { name: "Carrot", category: "base", value: 15, image: "images/fruits/carrot.png" },
  { name: "Strawberry", category: "base", value: 15, image: "images/fruits/strawberry.png" },
  { name: "Nectarine", category: "bee", value: 48000, image: "images/fruits/nectarine.png" },
  { name: "Stonebite", category: "prehistoric", value: 35000, image: "images/fruits/stonebite.png" },
  { name: "Soul Fruit", category: "event", value: 7750, image: "images/fruits/soulfruit.png" },
  { name: "Cursed Fruit", category: "event", value: 25570, image: "images/fruits/cursedfruit.png" },
];

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
      if (selectedFruit === fruit.name) div.classList.add("selected");
      div.innerHTML = `<img src="${fruit.image}" /><span>${fruit.name}</span>`;
      div.onclick = () => { selectedFruit = fruit.name; renderFruits(filter); };
      grid.appendChild(div);
    });
}

function renderMutations() {
  const container = document.getElementById("mutationContainer");
  container.innerHTML = "";
  mutations.forEach(m => {
    const btn = document.createElement("button");
    btn.innerText = m.name;
    btn.className = `mutation-btn ${m.name.replace(/\\s+/g, '')}`;
    if (selectedMutations.includes(m.name)) btn.classList.add("active");
    if (!canSelectMutation(m)) btn.classList.add("disabled");
    btn.onclick = () => toggleMutation(m.name);
    container.appendChild(btn);
  });
}

function toggleMutation(name) {
  if (selectedMutations.includes(name)) {
    selectedMutations = selectedMutations.filter(n => n !== name);
  } else {
    const m = mutations.find(m => m.name === name);
    if (canSelectMutation(m)) selectedMutations.push(name);
  }
  renderMutations();
}

function canSelectMutation(mutation) {
  const groupSelected = selectedMutations.map(name => mutations.find(m => m.name === name)?.group);
  if (mutation.group === "growth" && groupSelected.includes("growth")) return false;
  if (mutation.group === "cold" && groupSelected.includes("water")) return false;
  if (mutation.group === "water" && groupSelected.includes("cold")) return false;
  if (["Burnt", "Cooked"].includes(mutation.name) && selectedMutations.includes(mutation.name === "Burnt" ? "Cooked" : "Burnt")) return false;
  if (["Clay", "Ceramic"].includes(mutation.name) && selectedMutations.includes(mutation.name === "Clay" ? "Ceramic" : "Clay")) return false;
  if (["Verdant", "Sundried"].includes(mutation.name) && selectedMutations.includes("Paradisal")) return false;
  if (mutation.name === "Paradisal" && selectedMutations.some(m => ["Verdant", "Sundried"].includes(m))) return false;
  return true;
}

function filterFruits(cat) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderFruits(cat);
}

function calculate() {
  const weight = parseFloat(document.getElementById("weight").value);
  if (!selectedFruit || isNaN(weight)) return alert("Select a fruit and enter weight");
  const fruit = fruits.find(f => f.name === selectedFruit);
  const totalMultiplier = selectedMutations.reduce((acc, name) => {
    const m = mutations.find(m => m.name === name);
    return acc + (m ? m.multiplier : 0);
  }, 0);
  const value = (fruit.value * weight) * (1 + totalMultiplier);
  document.getElementById("result").innerText = `🍇 ${fruit.name} Value: $${value.toFixed(2)}`;
}

renderFruits();
renderMutations();
