```javascript
/**
 * ==========================================================================
 * IMORIA LEARNING - GLOBAL CORE PORTAL MECHANICS (main.js)
 * Project: AFNS Chemistry Test Prep Portal Interactivity Engine
 * Author: Expert Senior Front-End Developer
 * Year: 2026
 * ==========================================================================
 */

// Global state tracking for the test countdown interval
let mockTestInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the live countdown engine if on the mock test page
    initMockTimer();
});

/* --------------------------------------------------------------------------
   1. CHAPTER MCQ GRADER LOGIC
   -------------------------------------------------------------------------- */
/**
 * Grades a specific chapter's quiz form dynamically.
 * @param {string|number} chapterNum - The identifier of the target chapter section.
 */
function checkChapterQuiz(chapterNum) {
    // Safely query the specific form via data-chapter attribute assignment
    const quizForm = document.querySelector(`form[data-chapter="${chapterNum}"]`);
    const feedbackBox = document.getElementById(`feedback-ch${chapterNum}`);

    // Defensive check: abort execution if elements are structurally missing
    if (!quizForm || !feedbackBox) {
        console.error(`Quiz elements for Chapter ${chapterNum} could not be located in the DOM.`);
        return;
    }

    // Determine the total number of questions by evaluation of semantic question groups
    const questionGroups = quizForm.querySelectorAll('.question-group');
    const totalQuestions = questionGroups.length;

    // Collect all checked radio nodes inside this container form context
    const checkedOptions = quizForm.querySelectorAll('input[type="radio"]:checked');

    // Guard Clause: Validate if the user completed all questions before requesting grading
    if (checkedOptions.length < totalQuestions) {
        feedbackBox.textContent = "⚠️ Please answer all questions before checking your score.";
        feedbackBox.className = "quiz-feedback error";
        return;
    }

    // Calculate score metrics by filtering inputs matching strict correct data values
    let correctCount = 0;
    checkedOptions.forEach(option => {
        if (option.value === "correct") {
            correctCount++;
        }
    });

    // Output Result UI presentation updates
    feedbackBox.innerHTML = `Your Score: <strong>${correctCount} / ${totalQuestions}</strong>`;

    // Reset feedback styles and apply premium contextual color alerts matching style.css
    feedbackBox.className = "quiz-feedback"; // Clear previous state classifications
    
    if (correctCount === totalQuestions) {
        feedbackBox.classList.add('success');
    } else {
        feedbackBox.classList.add('error');
    }
}

/* --------------------------------------------------------------------------
   2. MOCK TEST LIVE COUNTDOWN ENGINE
   -------------------------------------------------------------------------- */
/**
 * Locates the live timer elements and handles automated tick schedules.
 */
function initMockTimer() {
    const timerDisplay = document.getElementById('mock-timer');
    
    // Abstract execution if page structure lacks mock timer component configuration
    if (!timerDisplay) return;

    // 30 Minutes standard competitive duration tracking metrics (30 * 60 seconds = 1800)
    let timeRemainingSeconds = 1800;

    // Set an interval updating the timer state securely every 1 second
    mockTestInterval = setInterval(() => {
        timeRemainingSeconds--;

        // Calculate modular breakdown parameters for text node conversions
        const minutes = Math.floor(timeRemainingSeconds / 60);
        const seconds = timeRemainingSeconds % 60;

        // Render clean presentation layouts through standard padStart string metrics
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

        // Anti-cheat verification event condition triggers auto submission on absolute expiration
        if (timeRemainingSeconds <= 0) {
            clearInterval(mockTestInterval);
            timerDisplay.textContent = "00:00";
            alert("⏰ Time has explicitly expired! The portal will now automatically evaluate your inputs.");
            submitGrandTest();
        }
    }, 1000);
}

/* --------------------------------------------------------------------------
   3. GRAND MOCK TEST EVALUATOR
   -------------------------------------------------------------------------- */
/**
 * Aggregates answers, stops timers, prints complete breakdown parameters, and scrolls window view.
 */
function submitGrandTest() {
    // Immediately clear down intervals to protect remaining timestamps
    if (mockTestInterval) {
        clearInterval(mockTestInterval);
    }

    const testForm = document.getElementById('grand-mock-test');
    const resultsBox = document.getElementById('test-results-box');

    // Defensive handling: terminate execution if form context is invalid
    if (!testForm || !resultsBox) {
        console.error("Critical components for Grand Test Evaluation are missing from the current layout.");
        return;
    }

    const totalMockQuestions = 15;

    // Compute verified selection metrics matching functional requirement structures
    const correctAnswers = testForm.querySelectorAll('input[type="radio"]:checked[value="correct"]').length;
    
    // Calculate final percentage score metrics safely
    const finalPercentage = Math.round((correctAnswers / totalMockQuestions) * 100);

    // Formulate semantic institutional verdict status parameters
    let statusVerdictHTML = "";
    if (finalPercentage >= 50) {
        statusVerdictHTML = `<p class="grade-verdict" style="color: var(--success);">STATUS: PASSED (Excellent Preparation!)</p>`;
    } else {
        statusVerdictHTML = `<p class="grade-verdict" style="color: var(--error);">STATUS: RETAIN (Keep Studying Notes!)</p>`;
    }

    // Inject structured premium layout report cards dynamically into DOM
    resultsBox.innerHTML = `
        <h2>Grand Mock Test Results Summary</h2>
        <p class="score-display">${correctAnswers} / ${totalMockQuestions}</p>
        <p class="meta-breakdown" style="font-weight: 600; margin-bottom: 0.5rem;">
            Percentage Grade achieved: ${finalPercentage}%
        </p>
        ${statusVerdictHTML}
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">
            Review your chemistry notes or attempt the practice quizzes again to optimize performance.
        </p>
    `;

    // Remove hidden utility classes to show the dynamically populated results dashboard instantly
    resultsBox.classList.remove('hidden');

    // High-end smooth viewport adjustment response event to showcase evaluation grades instantly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

```
