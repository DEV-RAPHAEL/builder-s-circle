// Admissions Quiz State Management
const STATE = {
  currentQuizStep: 1,
  quizAnswers: {
    step1: null,
    step2: null,
    step3: null
  }
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  updateQuizView();
  showWarningModal();

  // Sticky Apply button: appear after user scrolls 400px
  const stickyBtn = document.getElementById("sticky-apply");
  if (stickyBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        stickyBtn.classList.add("visible");
      } else {
        stickyBtn.classList.remove("visible");
      }
    }, { passive: true });
  }

  const modalClose = document.getElementById("warning-modal-close");
  const modalOverlay = document.getElementById("warning-modal-overlay");
  if (modalClose) {
    modalClose.addEventListener("click", closeWarningModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeWarningModal);
  }
});

function showWarningModal() {
  const modal = document.getElementById("warning-modal");
  if (!modal) return;
  modal.classList.add("visible");
  document.body.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeWarningModal() {
  const modal = document.getElementById("warning-modal");
  if (!modal) return;
  modal.classList.remove("visible");
  document.body.classList.remove("modal-open");
  modal.setAttribute("aria-hidden", "true");
}

// ADMISSIONS QUIZ LOGIC
window.selectQuizOption = function(stepNum, val) {
  STATE.quizAnswers[`step${stepNum}`] = val;
  
  // Highlight selected button
  const stepEl = document.getElementById(`step-${stepNum}`);
  if (stepEl) {
    stepEl.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      const isSelected = (stepNum === 1 && val === 'builder' && btn.textContent.includes('actively')) ||
                         (stepNum === 1 && val === 'motivation' && btn.textContent.includes('motivated')) ||
                         (stepNum === 2 && val === 'accept' && btn.textContent.includes('accept')) ||
                         (stepNum === 2 && val === 'reject' && btn.textContent.includes('read posts')) ||
                         (stepNum === 3 && val === 'yes' && btn.textContent.includes('Yes')) ||
                         (stepNum === 3 && val === 'no' && btn.textContent.includes('No'));
      btn.classList.toggle("selected", isSelected);
    });
  }

  const nextBtn = document.getElementById("quiz-next-btn");
  if (nextBtn) {
    nextBtn.removeAttribute("disabled");
  }
};

window.nextQuizStep = function() {
  if (STATE.currentQuizStep < 3) {
    STATE.currentQuizStep += 1;
    updateQuizView();
  } else {
    evaluateQuiz();
  }
};

window.prevQuizStep = function() {
  if (STATE.currentQuizStep > 1) {
    STATE.currentQuizStep -= 1;
    updateQuizView();
  }
};

function updateQuizView() {
  // Update visibility of steps
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.toggle("active", i === STATE.currentQuizStep);
  }

  // Update Progress Line
  const progressLine = document.getElementById("quiz-progress-line");
  if (progressLine) {
    progressLine.style.width = `${((STATE.currentQuizStep - 1) / 3) * 100}%`;
  }

  // Back button visibility
  const prevBtn = document.getElementById("quiz-prev-btn");
  if (prevBtn) {
    prevBtn.style.visibility = STATE.currentQuizStep > 1 ? "visible" : "hidden";
  }

  // Next button activation / text
  const nextBtn = document.getElementById("quiz-next-btn");
  if (nextBtn) {
    nextBtn.textContent = STATE.currentQuizStep === 3 ? "Submit Quiz" : "Next Question";
    
    // Disable next button if answer for current step is not selected
    const currentAnswer = STATE.quizAnswers[`step${STATE.currentQuizStep}`];
    if (currentAnswer) {
      nextBtn.removeAttribute("disabled");
    } else {
      nextBtn.setAttribute("disabled", "true");
    }
  }
}

function evaluateQuiz() {
  const ans = STATE.quizAnswers;
  const isQualified = ans.step1 === 'builder' && ans.step2 === 'accept' && ans.step3 === 'yes';

  // Hide quiz container card
  const quizCard = document.getElementById("quiz-card");
  if (quizCard) {
    quizCard.style.display = "none";
  }

  if (isQualified) {
    const qualScreen = document.getElementById("qualified-screen");
    if (qualScreen) qualScreen.classList.add("active");
  } else {
    const disqualScreen = document.getElementById("disqualified-screen");
    if (disqualScreen) disqualScreen.classList.add("active");
  }
}

window.restartQuiz = function() {
  // Reset quiz answers & current step
  STATE.currentQuizStep = 1;
  STATE.quizAnswers = { step1: null, step2: null, step3: null };

  // Hide other screens
  const qualScreen = document.getElementById("qualified-screen");
  if (qualScreen) qualScreen.classList.remove("active");

  const disqualScreen = document.getElementById("disqualified-screen");
  if (disqualScreen) disqualScreen.classList.remove("active");

  const successScreen = document.getElementById("success-screen");
  if (successScreen) successScreen.classList.remove("active");

  // Show quiz card
  const quizCard = document.getElementById("quiz-card");
  if (quizCard) {
    quizCard.style.display = "flex";
  }

  // Reset options highlight class
  document.querySelectorAll(".quiz-opt-btn").forEach(btn => btn.classList.remove("selected"));

  updateQuizView();
};

// Application redirects to Google Forms — no local form submission needed.
