

// =======================================
// CHAPTER QUIZ EVALUATION ENGINE
// =======================================


function checkChapterQuiz(chapterNum) {


    const form = document.querySelector(
        `form[data-chapter="${chapterNum}"]`
    );


    if (!form) return;



    const questions =
        form.querySelectorAll(
            'input[type="radio"]'
        );



    let score = 0;

    let answered = new Set();



    questions.forEach(input => {


        if (input.checked) {


            answered.add(input.name);


            if (input.value === "correct") {

                score++;

            }


        }


    });





    const totalQuestions =
        answered.size;



    const feedback =
        document.getElementById(
            `feedback-ch${chapterNum}`
        );




    if (totalQuestions === 0) {


        feedback.className = "error";

        feedback.innerHTML =
        "Please attempt the questions first.";

        return;

    }





    const total =
        form.querySelectorAll(
            'input[type="radio"]'
        );



    const questionCount =
        [...new Set(
            [...total].map(
                q => q.name
            )
        )].length;




    if (totalQuestions < questionCount) {


        feedback.className="error";

        feedback.innerHTML =
        `Attempt all questions. You answered ${totalQuestions}/${questionCount}.`;

        return;

    }






    const percentage =
        Math.round(
            (score / questionCount) * 100
        );





    if (percentage >= 50) {


        feedback.className="success";


        feedback.innerHTML =
        `Excellent! Score: ${score}/${questionCount} (${percentage}%)`;



    } else {


        feedback.className="error";


        feedback.innerHTML =
        `Needs Revision. Score: ${score}/${questionCount} (${percentage}%)`;

    }


}








// =======================================
// GRAND MOCK TIMER ENGINE
// =======================================



let mockTimerInterval = null;

let remainingSeconds = 30 * 60;






function startMockTimer(){


    const timer =
        document.getElementById(
            "mock-timer"
        );


    if(!timer) return;




    function updateTimer(){


        let minutes =
            Math.floor(
                remainingSeconds / 60
            );


        let seconds =
            remainingSeconds % 60;




        timer.innerHTML =
            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;



        if(remainingSeconds <= 0){


            clearInterval(mockTimerInterval);


            submitGrandTest();


            return;

        }


        remainingSeconds--;


    }





    updateTimer();



    mockTimerInterval =
        setInterval(
            updateTimer,
            1000
        );



}








// =======================================
// GRAND TEST SUBMISSION
// =======================================



function submitGrandTest(){


    const form =
        document.getElementById(
            "grand-mock-test"
        );



    if(!form) return;





    if(mockTimerInterval){

        clearInterval(
            mockTimerInterval
        );

    }






    let score = 0;


    let answered = 0;



    const questions =
        form.querySelectorAll(
            'input[type="radio"]:checked'
        );




    questions.forEach(answer => {



        answered++;



        if(answer.value === "correct"){


            score++;

        }



    });







    const totalQuestions = 15;



    const percentage =
        Math.round(
            (score / totalQuestions) * 100
        );





    const results =
        document.getElementById(
            "test-results-box"
        );




    if(!results) return;





    let status;



    if(percentage >= 50){


        status =
        `
        <h2 class="success">
        PASS
        </h2>

        <p>
        Congratulations! You scored
        ${score}/${totalQuestions}
        (${percentage}%)
        </p>
        `;


    } else {


        status =
        `
        <h2 class="error">
        RETAIN
        </h2>

        <p>
        Score:
        ${score}/${totalQuestions}
        (${percentage}%)
        <br>
        Revise concepts and attempt again.
        </p>
        `;

    }







    results.innerHTML =
    `

    ${status}

    <p>
    Attempted Questions:
    ${answered}/${totalQuestions}
    </p>

    `;





    results.classList.remove(
        "hidden"
    );





    window.scrollTo({

        top:0,

        behavior:"smooth"

    });



}








// =======================================
// INITIALIZE PAGE FEATURES
// =======================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    startMockTimer();


}

);
