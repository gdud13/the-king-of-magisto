// Game State
let food = 4;
let health = 100;
let day = 1;
let herbs = 0;
let coins = 0;
let energy = 5;
let arrows = 10;

// UI Elements
const dayEl = document.getElementById('day');
const healthEl = document.getElementById('health');
const foodEl = document.getElementById('food');
const coinsEl = document.getElementById('coins');
const invFoodEl = document.getElementById('invFood');
const herbsEl = document.getElementById('herbs');
const storyEl = document.getElementById('story');
const energyEl = document.getElementById('energy');
const arrowsEl = document.getElementById('arrows');

// Buttons main screen
const huntBtn = document.getElementById('huntBtn');
const checkBtn = document.getElementById('checkBtn');
const restBtn = document.getElementById('restBtn');
const logBtn = document.getElementById('logBtn');

// Screens
const mainScreen = document.getElementById('mainScreen');
const roadScreen = document.getElementById('roadScreen');
const townScreen = document.getElementById('townScreen');

// Navigation buttons
const goToRoadBtn = document.getElementById('goToRoadBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const goToTownBtn = document.getElementById('goToTownBtn');
const backToRoadBtn = document.getElementById('backToRoadBtn');

// Store elements & buttons
const storeScreen = document.getElementById('storeScreen');
const storeDialogue = document.getElementById('storeDialogue');
const butcherBtn = document.getElementById('butcherBtn');
const blacksmithBtn = document.getElementById('blacksmithBtn');
const herbalistBtn = document.getElementById('herbalistBtn');

// Update UI function
function updateUI() {
  dayEl.textContent = day;
  healthEl.textContent = health;
  foodEl.textContent = food;
  coinsEl.textContent = coins;
  invFoodEl.textContent = food;
  herbsEl.textContent = herbs;
  energyEl.textContent = energy;
  arrowsEl.textContent = arrows;

  // Disable hunt and check based on energy/arrows
  huntBtn.disabled = energy <= 0 || arrows <= 0;
  checkBtn.disabled = energy <= 0;
  restBtn.disabled = energy >= 5;

  // Disable store buttons if player cannot afford/sell
  butcherBtn.disabled = food < 3;
  blacksmithBtn.disabled = coins < 5;
  herbalistBtn.disabled = herbs < 1;
}

// Show one screen at a time
function showScreen(screen) {
  mainScreen.style.display = 'none';
  roadScreen.style.display = 'none';
  townScreen.style.display = 'none';
  storeScreen.style.display = 'none';

  if (screen === townScreen) {
    townScreen.style.display = 'flex';
    storeScreen.style.display = 'flex';  // Show store inside town
  } else {
    screen.style.display = 'flex';
  }
}

// Hunting logic
function hunt() {
  if (energy <= 0 || arrows <= 0) return;
  arrows--;
  energy--;
  if (Math.random() < 0.8) {
    const gain = Math.floor(Math.random() * 3) + 1;
    food += gain;
    storyEl.innerHTML = `Your arrow strikes true. You collect +${gain} food.`;
  } else {
    storyEl.textContent = 'You missed your shot. The animal escapes into the trees.';
  }
  updateUI();
}

// Check surroundings logic
function checkSurroundings() {
  if (energy <= 0) return;
  energy--;
  const events = [
    'You find strange footprints in the mud.',
    'The wind carries the howl of wolves.',
    'You gather wild herbs near a tree (+1 herb).',
    'You spot a deer in the distance.',
    'The forest seems calm, but watchful.'
  ];
  const idx = Math.floor(Math.random() * events.length);
  storyEl.textContent = events[idx];
  if (idx === 2) herbs++;
  updateUI();
}

// Rest logic
function rest() {
  if (energy >= 5) {
    storyEl.textContent = 'You already feel rested.';
    return;
  }

  day++; // Advance day

  if (food > 0) {
    food--;
    energy = 5;
    storyEl.textContent = 'You eat and rest. Energy restored. (-1 food, +1 day)';
  } else {
    health -= 10;
    if (health < 0) health = 0;
    energy = 5;
    storyEl.textContent = 'You rest without food. It takes a toll. (-10 health, +1 day)';
  }

  updateUI();
}

// Story log placeholder
function logEvent() {
  alert('Story log coming soon!');
}

// Navigation handlers
goToRoadBtn.addEventListener('click', () => {
  showScreen(roadScreen);
  storyEl.textContent = 'You step onto the dusty road leading away from the forest.';
});

backToMainBtn.addEventListener('click', () => {
  showScreen(mainScreen);
  storyEl.textContent = 'You return to the peaceful wilderness clearing.';
});

goToTownBtn.addEventListener('click', () => {
  showScreen(townScreen);
  storyEl.textContent = 'You arrive at Stonewell, a bustling town.';
});

backToRoadBtn.addEventListener('click', () => {
  showScreen(roadScreen);
  storyEl.textContent = 'You return to the fork in the road.';
});


// Butcher: Sell 3 food for 1 coin
butcherBtn.addEventListener('click', () => {
  if (food >= 3) {
    food -= 3;
    coins += 1;
    storeDialogue.textContent = 'Who dragged this mutt in here? You sold 3 food for 1 coin.';
    updateUI();
  }
});

// Blacksmith: Buy 10 arrows for 5 coins
blacksmithBtn.addEventListener('click', () => {
  if (coins >= 5) {
    coins -= 5;
    arrows += 10;
    storeDialogue.textContent = 'A fine set of arrows for your quiver. You bought 10 arrows for 5 coins.';
    updateUI();
  }
});

// Herbalist: Sell 1 herb for 1 coin
herbalistBtn.addEventListener('click', () => {
  if (herbs >= 1) {
    herbs -= 1;
    coins += 1;
    storeDialogue.textContent = 'The herbalist accepts your herbs. You sold 1 herb for 1 coin.';
    updateUI();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'c' || e.key === 'C') {
    checkSurroundings();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'd') {
    hunt();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'r') {
    rest();
  }
});

function saveGame() {
  const gameState = {
    day,
    health,
    food,
    herbs,
    coins,
    energy,
    arrows
  };
  localStorage.setItem('magistoSave', JSON.stringify(gameState));
  storyEl.textContent = "💾 Game saved successfully!";
}

function loadGame() {
  const saved = localStorage.getItem('magistoSave');
  if (saved) {
    const gameState = JSON.parse(saved);
    day = gameState.day;
    health = gameState.health;
    food = gameState.food;
    herbs = gameState.herbs;
    coins = gameState.coins;
    energy = gameState.energy;
    arrows = gameState.arrows;
    updateUI();
    storyEl.textContent = "📂 Game loaded!";
  } else {
    storyEl.textContent = "⚠️ No saved game found.";
  }
}

// Attach main screen buttons
huntBtn.addEventListener('click', hunt);
checkBtn.addEventListener('click', checkSurroundings);
restBtn.addEventListener('click', rest);
logBtn.addEventListener('click', logEvent);

// Initial UI update
updateUI();

// Show main screen initially
showScreen(mainScreen);
