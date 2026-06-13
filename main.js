// ===================== CHAPTER QUIZ CHECKER (mcqs.html) =====================
// Handles Chapters 1-13, each with 20 questions (ch{N}q1 ... ch{N}q20)

function checkChapterQuiz(chapterNum) {
    const form = document.querySelector(`form[data-chapter="${chapterNum}"]`);
    if (!form) return;

    const totalQuestions = 20;
    let score = 0;
    let unanswered = 0;

    // Clear previous highlighting
    form.querySelectorAll('.option-label').forEach(label => {
        label.classList.remove('correct-answer', 'wrong-answer');
    });

    for (let i = 1; i <= totalQuestions; i++) {
        const name = `ch${chapterNum}q${i}`;
        const options = form.querySelectorAll(`input[name="${name}"]`);
        if (options.length === 0) continue;

        const selected = form.querySelector(`input[name="${name}"]:checked`);

        options.forEach(opt => {
            const label = opt.parentElement;
            if (opt.value === 'correct') {
                label.classList.add('correct-answer');
            } else if (selected && opt === selected && opt.value !== 'correct') {
                label.classList.add('wrong-answer');
            }
        });

        if (!selected) {
            unanswered++;
        } else if (selected.value === 'correct') {
            score++;
        }
    }

    const feedback = document.getElementById(`feedback-ch${chapterNum}`);
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= (totalQuestions * 0.6); // 60% pass threshold for chapter quizzes

    feedback.textContent = `Score: ${score}/${totalQuestions} (${percentage}%)` +
        (unanswered > 0 ? ` — ${unanswered} unanswered` : '') +
        (passed ? ' — Great job! 🎉' : ' — Review this chapter again. 📖');

    feedback.className = 'feedback ' + (passed ? 'pass' : 'fail');

    // Scroll feedback into view smoothly
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===================== SMOOTH SCROLL FOR SIDEBAR LINKS (chemistry-notes.html) =====================
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.notes-sidebar a[href^="#"]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Highlight active sidebar link on scroll
    const chapters = document.querySelectorAll('.chapter-block');
    if (chapters.length > 0 && sidebarLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sidebarLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.notes-sidebar a[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        chapters.forEach(chapter => observer.observe(chapter));
    }
});
