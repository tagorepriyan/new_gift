// Teddy Day Surprise Logic
console.log("Teddy Day Surprise Loaded 🧸");

// --- Configuration ---
const ASSETS = {
  pikachu: "Only pikachu.png",
  pikachuPanda: "both panda and pikachu.png", // Used for the "odd" slide
  panda: "only panda.png",
  finalCouple: "both panda and pikachu.png"
};

const SLIDESHOW_INTERVAL = 2500; // 2.5 seconds per slide
const ODD_SLIDE_INDEX = 2; // The 3rd slide (index 2) is the special one

// --- DOM Elements ---
const screens = {
  landing: document.getElementById("landing"),
  slideshow: document.getElementById("slideshow"),
  reveal: document.getElementById("reveal")
};

const elements = {
  startBtn: document.getElementById("startButton"),
  slideFrame: document.getElementById("slideFrame"),
  slideContent: document.getElementById("slide"),
  slideImage: document.getElementById("slideImage"),
  tapHint: document.getElementById("tapHint"),
  progressFill: document.getElementById("progressFill"),
  revealPikachu: document.getElementById("revealPikachu"),
  revealPanda: document.getElementById("revealPanda"),
  revealContent: document.getElementById("revealContent"),
  hugBtn: document.getElementById("hugButton"),
  hugText: document.getElementById("hugText")
};

const audio = {
  reveal: document.getElementById("revealSound"),
  bgm: document.getElementById("bgm")
};

// --- State ---
let state = {
  currentSlide: 0,
  timer: null,
  progressTimer: null,
  isPaused: false,
  foundOddOne: false
};

const slides = [
  { color: "#FDE2E4", img: ASSETS.pikachu },     // Pinkish
  { color: "#FFF1E6", img: ASSETS.pikachu },     // Beigeish
  { color: "#E2ECE9", img: ASSETS.pikachuPanda }, // Odd one! (Greenish tint)
  { color: "#FEF9C3", img: ASSETS.pikachu }      // Yellowish
];

// --- Functions ---

function switchScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach(s => s.classList.remove("screen--active"));
  // Show target screen
  screens[screenName].classList.add("screen--active");
}

function startSlideshow() {
  switchScreen("slideshow");
  playBGM();
  runSlideCycle();
}

function runSlideCycle() {
  if (state.foundOddOne) return; // Stop if game over

  showSlide(state.currentSlide);
  resetProgress();

  // Clear previous timers
  if (state.timer) clearTimeout(state.timer);

  // Set next slide timer
  state.timer = setTimeout(() => {
    state.currentSlide = (state.currentSlide + 1) % slides.length;
    runSlideCycle();
  }, SLIDESHOW_INTERVAL);
}

function showSlide(index) {
  const slide = slides[index];
  
  // Update visuals
  elements.slideContent.style.backgroundColor = slide.color;
  elements.slideImage.src = slide.img;
  
  // Reset hint
  elements.tapHint.classList.remove("show");

  // If this is the odd slide, handle specific logic
  if (index === ODD_SLIDE_INDEX) {
    // Show hint after a delay if they don't tap immediately
    setTimeout(() => {
      if (state.currentSlide === ODD_SLIDE_INDEX && !state.foundOddOne) {
        elements.tapHint.classList.add("show");
      }
    }, 1200);
  }
}

function resetProgress() {
  // Simple CSS animation reset trick
  elements.progressFill.style.transition = 'none';
  elements.progressFill.style.width = '0%';
  setTimeout(() => {
    elements.progressFill.style.transition = `width ${SLIDESHOW_INTERVAL}ms linear`;
    elements.progressFill.style.width = '100%';
  }, 50);
}

function handleSlideTap() {
  if (state.currentSlide === ODD_SLIDE_INDEX) {
    triggerReveal();
  } else {
    // Shake effect for wrong tap?
    elements.slideFrame.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 300 });
  }
}

function triggerReveal() {
  state.foundOddOne = true;
  if (state.timer) clearTimeout(state.timer);
  
  // Play sound
  if (audio.reveal) {
    audio.reveal.currentTime = 0;
    audio.reveal.play().catch(e => console.log("Audio play failed:", e));
  }

  // Go to reveal screen
  switchScreen("reveal");

  // Animate the reveal
  setTimeout(() => {
    elements.revealPikachu.classList.add("move-aside");
    elements.revealPanda.classList.add("reveal-panda-show");
    elements.revealContent.classList.add("show");
  }, 500); // Small delay for dramatic effect
}

function playBGM() {
  if (audio.bgm) {
    audio.bgm.volume = 0.3;
    audio.bgm.play().catch(e => console.log("BGM play failed (autoplay policy):", e));
  }
}

// --- Event Listeners ---

elements.startBtn.addEventListener("click", () => {
  startSlideshow();
});

elements.slideContent.addEventListener("click", handleSlideTap);

// Pause on hover/touch
elements.slideContent.addEventListener("pointerdown", () => {
  if (state.timer) {
    clearTimeout(state.timer);
    elements.progressFill.style.transition = 'none'; // Pause progress
  }
});

// Resume on release (if not the correct one)
elements.slideContent.addEventListener("pointerup", () => {
  if (!state.foundOddOne) {
     // Small delay to prevent instant jumping if they were just checking
     setTimeout(runSlideCycle, 500);
  }
});

elements.hugBtn.addEventListener("click", () => {
  elements.hugText.classList.add("show");
  elements.revealPanda.classList.add("panda-hug-anim");
  
  // Confetti or extra flourish could go here
});

