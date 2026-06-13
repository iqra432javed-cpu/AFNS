const QuizEngine = (function(){

  let state = {
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    mode: "practice",
    timer: null,
    timeLeft: 0,
    topicId: "default",
    locked: false
  };

  let config = {
    instantFeedback: true,
    timePerQuestion: 60,
    totalTime: null
  };

  function init(questions, options = {}){
    state.questions = questions;
    state.currentIndex = 0;
    state.userAnswers = new Array(questions.length).fill(null);
    state.mode = options.mode || "practice";
    state.topicId = options.topicId || "default";
    state.locked = false;

    if(options.instantFeedback !== undefined) config.instantFeedback = options.instantFeedback;
    if(options.timePerQuestion) config.timePerQuestion = options.timePerQuestion;
    if(options.totalTime) config.totalTime = options.totalTime;

    if(state.mode === "afns"){
      config.instantFeedback = false;
      startTimer();
    }

    loadProgress();
    renderQuestion();
    updateProgressBar();
    bindNavigation();
  }

  function startTimer(){
    if(state.timer) clearInterval(state.timer);

    state.timeLeft = config.totalTime || (config.timePerQuestion * state.questions.length);

    const timerEl = document.querySelector(".timer-display");
    updateTimerDisplay(timerEl);

    state.timer = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay(timerEl);

      if(state.timeLeft <= 0){
        clearInterval(state.timer);
        submitQuiz();
      }
    }, 1000);
  }

  function updateTimerDisplay(el){
    if(!el) return;
    const mins = Math.floor(state.timeLeft / 60);
    const secs = state.timeLeft % 60;
    el.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  function renderQuestion(){
    const q = state.questions[state.currentIndex];
    if(!q) return;

    const questionEl = document.querySelector(".question");
    const optionsEl = document.querySelector(".options");

    if(questionEl) questionEl.textContent = q.question;

    if(optionsEl){
      optionsEl.innerHTML = "";

      q.options.forEach((opt, idx) => {
        const optionBtn = document.createElement("button");
        optionBtn.className = "option-item";
        optionBtn.type = "button";
        optionBtn.dataset.index = idx;

        const label = String.fromCharCode(65 + idx);
        optionBtn.textContent = `${label}. ${opt}`;

        const userAns = state.userAnswers[state.currentIndex];

        if(userAns === idx){
          optionBtn.classList.add("selected");
        }

        if(config.instantFeedback && userAns !== null){
          optionBtn.disabled = true;
          if(idx === q.correct){
            optionBtn.classList.add("correct-answer");
          } else if(idx === userAns && userAns !== q.correct){
            optionBtn.classList.add("wrong-answer");
          }
        }

        optionBtn.addEventListener("click", () => selectAnswer(idx));
        optionsEl.appendChild(optionBtn);
      });
    }

    updateNavButtons();
    updateProgressBar();
  }

  function selectAnswer(idx){
    const userAns = state.userAnswers[state.currentIndex];

    if(config.instantFeedback && userAns !== null) return;

    state.userAnswers[state.currentIndex] = idx;
    saveProgress();
    renderQuestion();
  }

  function nextQuestion(){
    if(state.currentIndex < state.questions.length - 1){
      state.currentIndex++;
      renderQuestion();
    }
  }

  function prevQuestion(){
    if(state.currentIndex > 0){
      state.currentIndex--;
      renderQuestion();
    }
  }

  function updateNavButtons(){
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const submitBtn = document.querySelector(".submit-btn");

    if(prevBtn) prevBtn.disabled = state.currentIndex === 0;

    if(nextBtn){
      nextBtn.style.display = state.currentIndex === state.questions.length - 1 ? "none" : "inline-block";
    }

    if(submitBtn){
      submitBtn.style.display = state.currentIndex === state.questions.length - 1 ? "inline-block" : "none";
    }
  }

  function updateProgressBar(){
    const progressEl = document.querySelector(".progress-bar");
    if(!progressEl) return;

    const percent = ((state.currentIndex + 1) / state.questions.length) * 100;

    progressEl.style.width = `${percent}%`;
    progressEl.setAttribute("aria-valuenow", percent);

    const progressText = document.querySelector(".progress-text");
    if(progressText){
      progressText.textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
    }
  }

  function calculateScore(){
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    state.questions.forEach((q, idx) => {
      const userAns = state.userAnswers[idx];

      if(userAns === null){
        unattempted++;
      } else if(userAns === q.correct){
        correct++;
      } else {
        wrong++;
      }
    });

    const total = state.questions.length;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;

    return { total, correct, wrong, unattempted, percentage };
  }

  function getPerformanceMessage(percentage){
    if(percentage >= 85) return "Excellent! You have mastered this topic.";
    if(percentage >= 70) return "Good work! Keep practicing to perfect it.";
    if(percentage >= 50) return "Fair attempt. Review the concepts again.";
    return "Needs Improvement. Revise this chapter thoroughly.";
  }

  function submitQuiz(){
    if(state.timer) clearInterval(state.timer);
    state.locked = true;

    const result = calculateScore();
    const message = getPerformanceMessage(result.percentage);

    displayResult(result, message);
    saveFinalResult(result);
  }

  function displayResult(result, message){
    const scoreBoard = document.querySelector(".score-board");
    if(!scoreBoard) return;

    scoreBoard.innerHTML = `
      <div class="result-panel">
        <h3>Quiz Result</h3>
        <p>Total Questions: <strong>${result.total}</strong></p>
        <p>Correct Answers: <strong>${result.correct}</strong></p>
        <p>Wrong Answers: <strong>${result.wrong}</strong></p>
        <p>Unattempted: <strong>${result.unattempted}</strong></p>
        <p>Score: <strong>${result.correct} / ${result.total}</strong></p>
        <p>Percentage: <strong>${result.percentage}%</strong></p>
        <p class="performance-message">${message}</p>
      </div>
    `;

    const questionEl = document.querySelector(".question");
    const optionsEl = document.querySelector(".options");
    const navEl = document.querySelector(".nav-buttons");

    if(questionEl) questionEl.style.display = "none";
    if(optionsEl) optionsEl.style.display = "none";
    if(navEl) navEl.style.display = "none";
  }

  function bindNavigation(){
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const submitBtn = document.querySelector(".submit-btn");

    if(nextBtn) nextBtn.addEventListener("click", nextQuestion);
    if(prevBtn) prevBtn.addEventListener("click", prevQuestion);
    if(submitBtn) submitBtn.addEventListener("click", () => {
      const result = calculateScore();
      if(result.unattempted > 0 && state.mode !== "afns"){
        const proceed = confirm(`You have ${result.unattempted} unanswered question(s). Submit anyway?`);
        if(!proceed) return;
      }
      submitQuiz();
    });
  }

  function saveProgress(){
    const key = `quiz_progress_${state.topicId}`;
    const data = {
      currentIndex: state.currentIndex,
      userAnswers: state.userAnswers,
      mode: state.mode,
      timestamp: Date.now()
    };
    try{
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e){}
  }

  function loadProgress(){
    const key = `quiz_progress_${state.topicId}`;
    try{
      const saved = localStorage.getItem(key);
      if(saved){
        const data = JSON.parse(saved);
        if(data.userAnswers && data.userAnswers.length === state.questions.length){
          state.userAnswers = data.userAnswers;
          state.currentIndex = data.currentIndex || 0;
        }
      }
    } catch(e){}
  }

  function saveFinalResult(result){
    try{
      const historyKey = "afns_quiz_history";
      let history = JSON.parse(localStorage.getItem(historyKey)) || [];

      history.push({
        topicId: state.topicId,
        mode: state.mode,
        score: result.correct,
        total: result.total,
        percentage: result.percentage,
        date: new Date().toISOString()
      });

      localStorage.setItem(historyKey, JSON.stringify(history));

      const topicProgressKey = `topic_progress_${state.topicId}`;
      localStorage.setItem(topicProgressKey, JSON.stringify({
        completed: true,
        bestScore: result.percentage,
        lastAttempt: new Date().toISOString()
      }));

      localStorage.setItem("afns_last_score", JSON.stringify({
        topicId: state.topicId,
        score: result.correct,
        total: result.total,
        percentage: result.percentage
      }));

      localStorage.removeItem(`quiz_progress_${state.topicId}`);
    } catch(e){}
  }

  function getTopicProgress(topicId){
    try{
      const data = localStorage.getItem(`topic_progress_${topicId}`);
      return data ? JSON.parse(data) : null;
    } catch(e){
      return null;
    }
  }

  function getQuizHistory(){
    try{
      return JSON.parse(localStorage.getItem("afns_quiz_history")) || [];
    } catch(e){
      return [];
    }
  }

  function getLastScore(){
    try{
      return JSON.parse(localStorage.getItem("afns_last_score"));
    } catch(e){
      return null;
    }
  }

  function resetQuiz(){
    state.currentIndex = 0;
    state.userAnswers = new Array(state.questions.length).fill(null);
    state.locked = false;

    localStorage.removeItem(`quiz_progress_${state.topicId}`);

    const scoreBoard = document.querySelector(".score-board");
    const questionEl = document.querySelector(".question");
    const optionsEl = document.querySelector(".options");
    const navEl = document.querySelector(".nav-buttons");

    if(scoreBoard) scoreBoard.innerHTML = "";
    if(questionEl) questionEl.style.display = "";
    if(optionsEl) optionsEl.style.display = "";
    if(navEl) navEl.style.display = "";

    if(state.mode === "afns") startTimer();

    renderQuestion();
  }

  function getAllTopicsProgress(topicIds){
    return topicIds.map(id => ({
      topicId: id,
      progress: getTopicProgress(id)
    }));
  }

  return {
    init,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    resetQuiz,
    selectAnswer,
    getQuizHistory,
    getLastScore,
    getTopicProgress,
    getAllTopicsProgress,
    calculateScore
  };

})();


const MCQData = {

  chapter1: [
    {
      question: "Who discovered the electron using the cathode ray tube experiment?",
      options: ["Ernest Rutherford", "J.J. Thomson", "James Chadwick", "Niels Bohr"],
      correct: 1
    },
    {
      question: "Which scientist discovered the neutron in 1932?",
      options: ["Robert Millikan", "Eugen Goldstein", "James Chadwick", "Henry Moseley"],
      correct: 2
    },
    {
      question: "What is the charge of an electron?",
      options: ["+1", "0", "-1", "+2"],
      correct: 2
    },
    {
      question: "Canal rays were first observed by which scientist?",
      options: ["Eugen Goldstein", "J.J. Thomson", "Robert Millikan", "Ernest Rutherford"],
      correct: 0
    },
    {
      question: "The charge of an electron was determined by which experiment?",
      options: ["Cathode Ray Tube", "Gold Foil Experiment", "Oil Drop Experiment", "Alpha Scattering"],
      correct: 2
    }
  ],

  chapter2: [
    {
      question: "Who proposed the atomic model with fixed circular orbits?",
      options: ["Rutherford", "Thomson", "Bohr", "Dalton"],
      correct: 2
    },
    {
      question: "What is the energy of an electron in the first orbit of hydrogen?",
      options: ["-13.6 eV", "0 eV", "+13.6 eV", "-3.4 eV"],
      correct: 0
    },
    {
      question: "Which series corresponds to the visible region of the hydrogen spectrum?",
      options: ["Lyman", "Balmer", "Paschen", "Brackett"],
      correct: 1
    },
    {
      question: "Bohr's model fails to explain the spectra of:",
      options: ["Hydrogen atom", "Multi-electron atoms", "Hydrogen-like ions", "None of these"],
      correct: 1
    }
  ],

  chapter3: [
    {
      question: "Who proposed the Quantum Theory in 1900?",
      options: ["Albert Einstein", "Max Planck", "Niels Bohr", "Louis de Broglie"],
      correct: 1
    },
    {
      question: "The equation E = hν relates energy to:",
      options: ["Mass", "Velocity", "Frequency", "Charge"],
      correct: 2
    },
    {
      question: "Who explained the photoelectric effect?",
      options: ["Max Planck", "Albert Einstein", "Werner Heisenberg", "Erwin Schrödinger"],
      correct: 1
    },
    {
      question: "de Broglie's equation is given by:",
      options: ["E = hν", "λ = h/mv", "ΔxΔp ≥ h/4π", "E = hc/λ"],
      correct: 1
    }
  ],

  chapter4: [
    {
      question: "How many quantum numbers describe an electron completely?",
      options: ["Two", "Three", "Four", "Five"],
      correct: 2
    },
    {
      question: "Which quantum number determines the orientation of an orbital?",
      options: ["Principal", "Azimuthal", "Magnetic", "Spin"],
      correct: 2
    }
  ],

  chapter9: [
    {
      question: "According to the Pauli Exclusion Principle, an orbital can hold maximum:",
      options: ["1 electron", "2 electrons", "3 electrons", "4 electrons"],
      correct: 1
    },
    {
      question: "Who proposed the Pauli Exclusion Principle?",
      options: ["Werner Heisenberg", "Wolfgang Pauli", "Friedrich Hund", "Erwin Schrödinger"],
      correct: 1
    }
  ],

  chapter11: [
    {
      question: "Mendeleev arranged elements based on increasing:",
      options: ["Atomic number", "Atomic mass", "Number of neutrons", "Electronegativity"],
      correct: 1
    },
    {
      question: "Eka-silicon, predicted by Mendeleev, was later discovered as:",
      options: ["Gallium", "Scandium", "Germanium", "Polonium"],
      correct: 2
    }
  ],

  chapter13: [
    {
      question: "Atomic radius generally decreases across a period due to:",
      options: ["Decreasing nuclear charge", "Increasing effective nuclear charge", "Decreasing shielding", "Addition of new shells"],
      correct: 1
    },
    {
      question: "Which is true about a cation compared to its parent atom?",
      options: ["Larger", "Smaller", "Same size", "Cannot be determined"],
      correct: 1
    }
  ]

};


function startChapterQuiz(chapterKey, options = {}){
  const questions = MCQData[chapterKey];
  if(!questions){
    console.error(`No MCQs found for ${chapterKey}`);
    return;
  }

  QuizEngine.init(questions, {
    topicId: chapterKey,
    mode: options.mode || "practice",
    instantFeedback: options.mode === "afns" ? false : true,
    timePerQuestion: options.timePerQuestion || 60,
    totalTime: options.totalTime || null
  });
}


function renderDashboard(topicIds){
  const dashboardEl = document.querySelector(".dashboard");
  if(!dashboardEl) return;

  const progressData = QuizEngine.getAllTopicsProgress(topicIds);

  dashboardEl.innerHTML = progressData.map(item => {
    const p = item.progress;
    const status = p ? `${p.percentage}% (Last: ${new Date(p.lastAttempt).toLocaleDateString()})` : "Not Attempted";
    return `
      <div class="dashboard-item">
        <span class="topic-name">${item.topicId}</span>
        <span class="topic-status">${status}</span>
      </div>
    `;
  }).join("");
}


function renderHistory(){
  const historyEl = document.querySelector(".history-list");
  if(!historyEl) return;

  const history = QuizEngine.getQuizHistory();

  if(history.length === 0){
    historyEl.innerHTML = "<p>No quiz history yet.</p>";
    return;
  }

  historyEl.innerHTML = history.slice().reverse().map(item => `
    <div class="history-item">
      <span>${item.topicId}</span>
      <span>${item.score}/${item.total}</span>
      <span>${item.percentage}%</span>
      <span>${new Date(item.date).toLocaleString()}</span>
    </div>
  `).join("");
}


document.addEventListener("DOMContentLoaded", function(){
  const chapterContainer = document.querySelector("[data-chapter-key]");
  if(chapterContainer){
    const chapterKey = chapterContainer.getAttribute("data-chapter-key");
    const mode = chapterContainer.getAttribute("data-mode") || "practice";
    startChapterQuiz(chapterKey, { mode });
  }

  const resetBtn = document.querySelector(".reset-btn");
  if(resetBtn){
    resetBtn.addEventListener("click", () => QuizEngine.resetQuiz());
  }

  if(document.querySelector(".dashboard")){
    renderDashboard(Object.keys(MCQData));
  }

  if(document.querySelector(".history-list")){
    renderHistory();
  }
});
