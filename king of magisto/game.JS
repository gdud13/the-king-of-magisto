// Game State
let food = 4;
let health = 100;
let day = 1;
let herbs = 0;
let coins = 0;
let energy = 5;
let arrows = 10;
let swordOwned = false;

// UI Elements
const dayEls = document.querySelectorAll('.day');
const healthEls = document.querySelectorAll('.health');
const energyEls = document.querySelectorAll('.energy');
const invFoodEls = document.querySelectorAll('.invFood');
const herbsEls = document.querySelectorAll('.herbs');
const arrowsEls = document.querySelectorAll('.arrows');
const coinsEls = document.querySelectorAll('.coins');

const storyEl = document.getElementById('story');

// Buttons
const huntBtn = document.getElementById('huntBtn');
const forageBtn = document.getElementById('forageBtn');
const restBtn = document.getElementById('restBtn');
const logBtn = document.getElementById('logBtn');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');
const buySwordBtn = document.getElementById('buySwordBtn');

// Screens
const mainScreen = document.getElementById('mainScreen');
const roadScreen = document.getElementById('roadScreen');
const townScreen = document.getElementById('townScreen');
const butcherScreen = document.getElementById('butcherScreen');
const blacksmithScreen = document.getElementById('blacksmithScreen');
const herbalistScreen = document.getElementById('herbalistScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

// Navigation buttons
const goToRoadBtn = document.getElementById('goToRoadBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const goToTownBtn = document.getElementById('goToTownBtn');
const backToRoadBtn = document.getElementById('backToRoadBtn');

const butcherEnterBtn = document.getElementById('butcherEnterBtn');
const blacksmithEnterBtn = document.getElementById('blacksmithEnterBtn');
const herbalistEnterBtn = document.getElementById('herbalistEnterBtn');

const sellFoodBtn = document.getElementById('sellFoodBtn');
const buyArrowsBtn = document.getElementById('buyArrowsBtn');
const sellHerbBtn = document.getElementById('sellHerbBtn');
const sellAllHerbsBtn = document.getElementById('sellAllHerbsBtn');

const backToTownBtns = document.querySelectorAll('.backToTownBtn');

const returnToMenuBtn = document.getElementById('returnToMenuBtn');

// Helper: Show one screen, hide all others
function showScreen(screen) {
  [mainScreen, roadScreen, townScreen, butcherScreen, blacksmithScreen, herbalistScreen, gameOverScreen].forEach(s => {
    s.style.display = 'none';
  });
  screen.style.display = 'flex';
}

// Update UI values and button states
function updateUI() {
  if (health <= 0) {
    // Trigger game over screen
    showScreen(gameOverScreen);
    return;
  }

  dayEls.forEach(el => (el.textContent = day));
  healthEls.forEach(el => (el.textContent = health));
  energyEls.forEach(el => (el.textContent = energy));
  invFoodEls.forEach(el => (el.textContent = food));
  herbsEls.forEach(el => (el.textContent = herbs));
  arrowsEls.forEach(el => (el.textContent = arrows));
  coinsEls.forEach(el => (el.textContent = coins));

  // Buttons enable/disable logic
  huntBtn.disabled = energy <= 0 || arrows <= 0 || health <= 0;
  forageBtn.disabled = energy <= 0 || health <= 0;
  restBtn.disabled = energy >= 5 || health <= 0;

  sellFoodBtn.disabled = food < 3 || health <= 0;
  buyArrowsBtn.disabled = coins < 5 || health <= 0;
  sellHerbBtn.disabled = herbs < 1 || health <= 0;
  sellAllHerbsBtn.disabled = herbs < 1 || health <= 0;

  buySwordBtn.disabled = swordOwned || coins < 20 || health <= 0;
  buySwordBtn.title = swordOwned
    ? "You already own a sword."
    : coins < 20
    ? "Not enough coins to buy a sword."
    : "Buy a sword for 20 coins.";
}

// Game actions
function hunt() {
  if (energy <= 0 || arrows <= 0 || health <= 0) return;

  arrows--;
  energy--;

  if (Math.random() < 0.8) {
    const gain = Math.floor(Math.random() * 3) + 1;
    food += gain;
    storyEl.textContent = `Your arrow strikes true. You collect +${gain} food.`;
  } else {
    storyEl.textContent = 'You missed your shot. The animal escapes into the trees.';
  }
  updateUI();
}

function forage() {
  if (energy <= 0 || health <= 0) return;

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

function rest() {
  if (energy >= 5 || health <= 0) {
    storyEl.textContent = 'You already feel rested.';
    return;
  }

  day++;

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

// Buy sword action
function buySword() {
  if (swordOwned) {
    storyEl.textContent = 'You already own a sword.';
    return;
  }
  if (coins < 20) {
    storyEl.textContent = 'Not enough coins to buy a sword.';
    return;
  }
  coins -= 20;
  swordOwned = true;
  storyEl.textContent = 'You purchased a sword! Now you can fight better.';
  updateUI();
}

// Placeholder for story log
function logEvent() {
  alert('Story log coming soon!');
}

// Navigation handlers
goToRoadBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(roadScreen);
  storyEl.textContent = 'You step onto the dusty road leading away from the forest.';
});

backToMainBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(mainScreen);
  storyEl.textContent = 'You return to the peaceful wilderness clearing.';
});

goToTownBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(townScreen);
  storyEl.textContent = 'You arrive at Stonewell, a bustling town.';
});

backToRoadBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(roadScreen);
  storyEl.textContent = 'You return to the fork in the road.';
});

butcherEnterBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(butcherScreen);
  storyEl.textContent = 'You enter the butcher\'s shop.';
});

blacksmithEnterBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(blacksmithScreen);
  storyEl.textContent = 'You enter the blacksmith\'s shop.';
});

herbalistEnterBtn.addEventListener('click', () => {
  if (health <= 0) return;
  showScreen(herbalistScreen);
  storyEl.textContent = 'You enter the herbalist\'s shop.';
});

backToTownBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (health <= 0) return;
    showScreen(townScreen);
    storyEl.textContent = 'You return to the town center.';
  });
});

// Shop actions
sellFoodBtn.addEventListener('click', () => {
  if (health <= 0) return;
  if (food >= 3) {
    food -= 3;
    coins++;
    storyEl.textContent = 'You sold 3 food to the butcher.';
    updateUI();
  } else {
    storyEl.textContent = 'Not enough food to sell.';
  }
});

buyArrowsBtn.addEventListener('click', () => {
  if (health <= 0) return;
  if (coins >= 5) {
    coins -= 5;
    arrows += 10;
    storyEl.textContent = 'You bought 10 arrows.';
    updateUI();
  } else {
    storyEl.textContent = 'Not enough coins.';
  }
});

sellHerbBtn.addEventListener('click', () => {
  if (health <= 0) return;
  if (herbs >= 1) {
    herbs--;
    coins++;
    storyEl.textContent = 'You sold 1 herb.';
    updateUI();
  } else {
    storyEl.textContent = 'No herbs to sell.';
  }
});

sellAllHerbsBtn.addEventListener('click', () => {
  if (health <= 0) return;
  if (herbs > 0) {
    const earnedCoins = herbs;
    coins += earnedCoins;
    herbs = 0;
    storyEl.textContent = `Sold all herbs for ${earnedCoins} coins.`;
    updateUI();
  } else {
    storyEl.textContent = 'You have no herbs to sell.';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (health <= 0) return;

  const key = e.key.toLowerCase();

  if (key === 'd') hunt();
  else if (key === 'f') forage();
  else if (key === 'r') rest();
});

// Export Save
exportBtn.addEventListener('click', () => {
  const save = { day, health, food, herbs, coins, energy, arrows, swordOwned };
  const blob = new Blob([JSON.stringify(save)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'magisto-save.json';
  a.click();
  storyEl.textContent = '📤 Save exported!';
});

// Import Save
importInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (validateSaveData(data)) {
        day = data.day;
        health = data.health;
        food = data.food;
        herbs = data.herbs;
        coins = data.coins;
        energy = data.energy;
        arrows = data.arrows;
        swordOwned = !!data.swordOwned;
        updateUI();
        storyEl.textContent = '📥 Save imported!';
        showScreen(mainScreen);
      } else {
        storyEl.textContent = '⚠️ Invalid save file.';
      }
    } catch {
      storyEl.textContent = '⚠️ Error reading save file.';
    }
  };
  reader.readAsText(file);
});

function validateSaveData(data) {
  return (
    typeof data.day === 'number' &&
    typeof data.health === 'number' &&
    typeof data.food === 'number' &&
    typeof data.herbs === 'number' &&
    typeof data.coins === 'number' &&
    typeof data.energy === 'number' &&
    typeof data.arrows === 'number'
  );
}

// Return to menu button handler (reload or redirect)
returnToMenuBtn.addEventListener('click', () => {
  // You can change this to your actual title screen URL or just reload
  window.location.href = 'intro.html'; 
});

// Attach action listeners
huntBtn.addEventListener('click', hunt);
forageBtn.addEventListener('click', forage);
restBtn.addEventListener('click', rest);
logBtn.addEventListener('click', logEvent);
buySwordBtn.addEventListener('click', buySword);

// Init
showScreen(mainScreen);
updateUI();
