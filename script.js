// ========== VIDEO ARRAYS ==========
const desktopVideos = [
  'video1.jpg', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4',
  'video6.mp4', 'video7.mp4', 'video8.mp4', 'video9.mp4', 'video10.mp4'
];
const mobileVideos = [
  'video1.jpg', 'mobile2.mp4', 'mobile3.mp4', 'mobile4.mp4', 'mobile5.mp4',
  'mobile6.mp4', 'mobile7.mp4', 'mobile8.mp4', 'mobile9.mp4', 'mobile10.mp4'
];

function getVideoArray() {
  return window.innerWidth <= 768 ? mobileVideos : desktopVideos;
}

let videoIndex = 0;

function changeVideo() {
  const video = document.getElementById('bg-video');
  const videos = getVideoArray();
  if (videos.length === 0) return;
  videoIndex = (videoIndex + 1) % videos.length;
  video.src = videos[videoIndex];
  video.load();
  video.play().catch(e => console.log('Autoplay prevented:', e));
}

// ========== QUESTION DATA ==========
const questions = [
  ["Are you 18+ 😉?", "Yes, I'm legal", "No (Access denied)"],
  ["What's your gender?", "Male", "Female"],
  ["What turns you on more?", "Straight (Male + Female)", "Same Sex (Gay/Lesbian)"],
  ["Who excites you more?", "Young & wild (18-25)", "Hot & mature (30+)"],
  ["What do you prefer watching?", "Real amateur fun", "Professional scenes"],
  ["What's your vibe?", "Slow & romantic 💖", "Rough & hardcore 💦"],
  ["Solo or couple action?", "Solo play", "Couples only"],
  ["Into rolrplry?", "Hell yes!", "Not really"],
  ["Like a little kink?", "BDSM, please 😈", "Keep it soft"],
  ["What's your flavor?", "Desi & spicy 🇮🇳", "International 🔥"]
];

// ========== DOM ELEMENTS ==========
const container = document.getElementById("question-container");
const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-fill");
const progressText = document.querySelector(".progress-text");
const finishContainer = document.getElementById("finish-container");
const notEligibleCard = document.getElementById("not-eligible-card");
const backButton = document.getElementById("back-button");
const contentBox = document.querySelector(".content-box");
const blurOverlay = document.getElementById("blur-overlay");

// ========== STATE ==========
const selections = new Array(questions.length).fill(null);
let isEligible = true;
let ageConfirmed = false; // tracks if user clicked "Yes" on first question

// ========== INITIALIZE QUESTIONS ==========
questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.className = "question-box";
  div.id = `q${i}`;
  div.innerHTML = `
    <div class="question-text"><strong>${q[0]}</strong></div>
    <div class="options">
      <div class="option" onclick="selectOption(${i}, 0)">${q[1]}</div>
      <div class="option" onclick="selectOption(${i}, 1)">${q[2]}</div>
    </div>`;
  container.appendChild(div);
});

// ========== FUNCTIONS ==========
function showQuestion(index) {
  if (!isEligible) return;
  document.querySelectorAll('.question-box').forEach(q => q.classList.remove('active'));
  if (index < questions.length) {
    document.getElementById(`q${index}`).classList.add('active');
    updateProgress(index);
  } else {
    progressContainer.style.display = 'none';
    finishContainer.style.display = 'flex';
  }
}

function updateProgress(index) {
  const percent = (index / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${index}/${questions.length}`;
}

function showNotEligible() {
  contentBox.style.display = 'none';
  notEligibleCard.style.display = 'block';
  // Keep blur overlay visible (it's already shown)
}

function resetVerification() {
  // Reset UI
  contentBox.style.display = 'block';
  notEligibleCard.style.display = 'none';
  progressContainer.style.display = 'flex';
  finishContainer.style.display = 'none';
  isEligible = true;
  ageConfirmed = false;

  // Show blur overlay again
  blurOverlay.classList.remove('hidden');
  blurOverlay.style.display = 'block';

  // Reset video to first
  videoIndex = 0;
  const video = document.getElementById('bg-video');
  const videos = getVideoArray();
  if (videos.length > 0) {
    video.src = videos[0];
    video.load();
    video.play().catch(e => console.log('Autoplay prevented:', e));
  }

  // Reset selections
  selections.fill(null);

  // Show first question
  showQuestion(0);
}

function selectOption(qIndex, optIndex) {
  // Store selection
  selections[qIndex] = questions[qIndex][optIndex + 1];
  localStorage.setItem("adultAnswers", JSON.stringify(selections));

  // ---- Handle first question specially ----
  if (qIndex === 0) {
    if (optIndex === 0) { // "Yes, I'm legal"
      // Remove blur overlay
      blurOverlay.classList.add('hidden');
      // Optionally we can set display none after transition
      setTimeout(() => {
        blurOverlay.style.display = 'none';
      }, 500);
      ageConfirmed = true;
      // Proceed to next question
      showQuestion(qIndex + 1);
      return;
    } else { // "No (Access denied)"
      isEligible = false;
      showNotEligible();
      // blur overlay remains visible (it's already shown)
      return;
    }
  }

  // For other questions, just change video and proceed
  if (!isEligible) return;

  // Change video on each click (after first question)
  changeVideo();

  // Go to next question
  showQuestion(qIndex + 1);
}

// ========== EVENT LISTENERS ==========
backButton.addEventListener('click', resetVerification);

// Handle window resize to switch video array
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const video = document.getElementById('bg-video');
    const videos = getVideoArray();
    if (videos.length > 0 && videoIndex < videos.length) {
      const currentSrc = video.src;
      const newSrc = videos[videoIndex];
      if (!currentSrc.includes(newSrc)) {
        video.src = newSrc;
        video.load();
        video.play().catch(e => console.log('Autoplay prevented:', e));
      }
    }
  }, 300);
});

// ========== INITIALIZATION ==========
window.onload = function() {
  // Set initial video
  const video = document.getElementById('bg-video');
  const videos = getVideoArray();
  if (videos.length > 0) {
    video.src = videos[0];
    video.load();
    video.play().catch(e => console.log('Autoplay prevented:', e));
  }

  // Ensure blur overlay is visible
  blurOverlay.style.display = 'block';
  blurOverlay.classList.remove('hidden');

  // Show first question (overlay is above but allows clicks)
  showQuestion(0);
};
