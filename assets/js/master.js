const sounds = {
  bgMusic: new Audio("./assets/audio/creepy.mp3"),
  flipSound: new Audio("./assets/audio/flip.wav"),
  matchSound: new Audio("./assets/audio/match.wav"),
  victorySound: new Audio("./assets/audio/victory.wav"),
  gameoverSound: new Audio("./assets/audio/gameover.wav"),
};

function playBgMusic(bgMusic) {
  sounds[bgMusic].currentTime = 0;
  sounds[bgMusic].loop = true;
  sounds[bgMusic].volume = 0.2;
  sounds[bgMusic].play();
}
function StopBgMusic(bgMusic) {
  sounds[bgMusic].pause();
  sounds[bgMusic].currentTime = 0;
}
function playflipSound(flipSound) {
  sounds[flipSound].currentTime = 0;
  sounds[flipSound].play();
}
function playmatchSound(matchSound) {
  sounds[matchSound].currentTime = 0;
  sounds[matchSound].play();
}
function playvictorySound(victorySound) {
  StopBgMusic("bgMusic");
  sounds[victorySound].currentTime = 0;
  sounds[victorySound].play();
}
function playgameoverSound(gameoverSound) {
  StopBgMusic("bgMusic");
  sounds[gameoverSound].currentTime = 0;
  sounds[gameoverSound].play();
}

const overLays = document.querySelectorAll(".overlay-text");
const startOverlay = document.getElementById("start-overlay-text");
const victoryOverlay = document.getElementById("victory-text");
const gameoverOverlay = document.getElementById("game-over-text");
const cards = document.querySelectorAll(".each-card");
const timeElement = document.querySelector("#game-time-span");
const flipsElement = document.querySelector("#game-flips-span");

let firstCard = null;
let secondCard = null;

let lockBoard = false;
let gameStarted = false;

let flips = 0;
let matchedPairs = 0;

let time = 100;
let timer = null;

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function updateTime() {
  timeElement.textContent = time;
}
function updateFlips() {
  flipsElement.textContent = flips;
}

function startGame() {
  lockBoard = false;

  startOverlay.classList.remove("flex");
  startOverlay.classList.add("hidden");

  flips = 0;
  matchedPairs = 0;
  time = 100;

  updateTime();
  updateFlips();

  playBgMusic("bgMusic");

  shuffleCards();
  gameStarted = true;
  clearInterval(timer);
  startTimer();
}
startOverlay.addEventListener("click", startGame);

// ****************************************** CARDS ******************************************
cards.forEach((card) => {
  const backElement = card.getElementsByClassName("back-element")[0];

  card.addEventListener("click", flipCard);
});

// FLIP
function flipCard() {
  // game didn't started yet
  if (!gameStarted) return;
  // Two cards are showing
  if (lockBoard) return;
  // if clicked twice on firstCard
  if (this === firstCard) return;
  // if both cards are matched
  // if (firstCard.dataset.status === secondCard.dataset.status) return;

  // sound
  playflipSound("flipSound");

  // flip card
  this.querySelector(".inner-card").classList.add("flipped");

  // increase flips
  flips++;
  updateFlips();

  // first card
  if (!firstCard) {
    firstCard = this;
    return;
  }
  // second card
  if (!secondCard) {
    secondCard = this;
    lockBoard = true;
    checkMatch();
  }
}

// check match
function checkMatch() {
  const isMatch = firstCard.dataset.status === secondCard.dataset.status;
  if (isMatch) {
    disableCards();
  } else {
    unflipCard();
  }
}
// disable cards
function disableCards() {
  // sound
  playmatchSound("matchSound");

  firstCard.classList.add("matched-card");
  secondCard.classList.add("matched-card");
  firstCard.querySelector(".back-element").classList.add("matched");
  secondCard.querySelector(".back-element").classList.add("matched");

  matchedPairs++;

  resetBoard();
  checkVictory();
}

// unflip cards
function unflipCard() {
  setTimeout(() => {
    firstCard.querySelector(".inner-card").classList.remove("flipped");
    secondCard.querySelector(".inner-card").classList.remove("flipped");
    resetBoard();
  }, 900);
}

// time
function startTimer() {
  timer = setInterval(() => {
    time--;
    updateTime();
    if (time <= 0) {
      gameLost();
    }
  }, 1000);
}

// gameOver
function gameLost() {
  clearInterval(timer);

  lockBoard = true;

  playgameoverSound("gameoverSound");

  gameoverOverlay.classList.remove("hidden");
  gameoverOverlay.classList.add("flex");
}

// restart game after game over
gameoverOverlay.addEventListener("click", restartGame);
function restartGame() {
  console.log("restart");
}
// restart game after victory
victoryOverlay.addEventListener("click", restartGame);

// victory
function checkVictory() {
  if (matchedPairs !== cards.length / 2) return;

  clearInterval(timer);

  lockBoard = true;

  playvictorySound("victorySound");

  victoryOverlay.classList.remove("hidden");
  victoryOverlay.classList.add("flex");
}

// restart game
function restartGame() {
  clearInterval(timer);

  victoryOverlay.classList.add("hidden");
  victoryOverlay.classList.remove("flex");
  gameoverOverlay.classList.add("hidden");
  gameoverOverlay.classList.remove("flex");

  gameStarted = false;

  flips = 0;
  matchedPairs = 0;
  time = 100;

  updateFlips();
  updateTime();

  cards.forEach((card) => {
    card.classList.remove("matched-card");
    card.querySelector(".inner-card").classList.remove("flipped");
    card.querySelector(".back-element").classList.remove("matched");
  });

  resetBoard();
  startGame();
}

// shuffle all cards
function shuffleCards() {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  shuffled.forEach((card, index) => {
    card.style.order = index;
  });
}