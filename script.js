// Teddy Day Surprise Interactions
// Replace image/audio file names in index.html if yours differ.

const landing = document.getElementById("landing");
const slideshow = document.getElementById("slideshow");
const reveal = document.getElementById("reveal");

const startButton = document.getElementById("startButton");
const slide = document.getElementById("slide");
const slidePikachu = document.getElementById("slidePikachu");
const tapHint = document.getElementById("tapHint");

const revealPikachu = document.getElementById("revealPikachu");
const revealPanda = document.getElementById("revealPanda");
const revealSound = document.getElementById("revealSound");
const bgm = document.getElementById("bgm");

const hugButton = document.getElementById("hugButton");
const hugText = document.getElementById("hugText");

let slideIndex = 0;
let slideInterval = null;
let hintTimeout = null;
let isPaused = false;

const slides = [
  {
    bg: "linear-gradient(120deg, #f8c9d6, #f8e9d6)",
    img: "Only pikachu.png"
  },
  {
    bg: "linear-gradient(120deg, #fff4c2, #f8c9d6)",
    img: "Only pikachu.png"
  },
  {
    bg: "linear-gradient(120deg, #f8e9d6, #fff4c2)",
    img: "both panda and pikachu.png"
  },
  {
    bg: "linear-gradient(120deg, #f8c9d6, #fff4c2)",
    img: "Only pikachu.png"
  }
];

const oddIndex = 2; // Slide with panda subtly visible

function setActiveScreen(active) {
  [landing, slideshow, reveal].forEach((screen) => {
    screen.classList.toggle("screen--active", screen === active);
  });
}

function updateSlide() {
  const current = slides[slideIndex];
  slide.style.background = current.bg;
  slidePikachu.src = current.img;
  tapHint.classList.remove("tap-hint--show");

  if (slideIndex === oddIndex) {
    hintTimeout = setTimeout(() => {
      tapHint.classList.add("tap-hint--show");
    }, 1800);
  }
}

function nextSlide() {
  if (isPaused) return;
  slideIndex = (slideIndex + 1) % slides.length;
  updateSlide();
}

function startSlideshow() {
  updateSlide();
  slideInterval = setInterval(nextSlide, 2400);
}

function pauseSlideshow() {
  isPaused = true;
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function resumeSlideshow() {
  if (!isPaused) return;
  isPaused = false;
  if (!slideInterval) {
    slideInterval = setInterval(nextSlide, 2400);
  }
}

function triggerReveal() {
  pauseSlideshow();
  clearTimeout(hintTimeout);

  slide.classList.add("dim");
  slide.classList.add("fade-out");

  if (revealSound) {
    revealSound.currentTime = 0;
    revealSound.play().catch(() => {});
  }

  setTimeout(() => {
    setActiveScreen(reveal);
    // Reveal animation: Pikachu slides, Panda fades in
    revealPikachu.classList.add("slide-pikachu-move");
    revealPanda.classList.add("panda-reveal");
  }, 800);
}

startButton.addEventListener("click", () => {
  setActiveScreen(slideshow);
  startSlideshow();

  // Optional background music (very low volume)
  if (bgm) {
    bgm.volume = 0.15;
    bgm.play().catch(() => {});
  }
});

slide.addEventListener("click", () => {
  if (slideIndex === oddIndex) {
    triggerReveal();
  }
});

slide.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (slideIndex === oddIndex) {
      triggerReveal();
    }
  }
});

// Pause slideshow on interaction and resume after
["pointerdown", "touchstart", "mouseenter"].forEach((eventName) => {
  slide.addEventListener(eventName, pauseSlideshow);
});

["pointerup", "touchend", "mouseleave"].forEach((eventName) => {
  slide.addEventListener(eventName, resumeSlideshow);
});

hugButton.addEventListener("click", () => {
  revealPanda.classList.add("hug");
  hugText.classList.add("hug-text--show");
});
