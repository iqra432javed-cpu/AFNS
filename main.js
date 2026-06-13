
/* =====================================================
   IMORIA LEARNING
   Interactive Portal Logic
===================================================== */



// =================================
// CHAPTER QUIZ CHECKER
// =================================


function checkChapterQuiz(chapterNum){


    const form =
    document.querySelector(
        `form[data-chapter="${chapterNum}"]`
    );


    if(!form) return;



    const questions =
    [...new Set(
        [...form.querySelectorAll("input")]
        .map(i=>i.name)
    )];



    let score = 0;

    let attempted = 0;




    questions.forEach(question=>{


        const answer =
        form.querySelector(
            `input[name="${question}"]:checked`
        );


        if(answer){


            attempted++;


            if(answer.value==="correct"){

                score++;

            }


        }


    });





    const feedback =
    document.getElementById(
        `feedback-ch${chapterNum}`
    );




    if(!feedback) return;




    if(attempted < questions.length){


        feedback.className="error";


        feedback.innerHTML =
        `
        ⚠ Please answer all questions.
        (${attempted}/${questions.length})
        `;


        return;

    }






    const percent =
    Math.round(
        score / questions.length * 100
    );





    if(percent >= 50){


        feedback.className="success";


        feedback.innerHTML =
        `
        🎉 Excellent!
        Score ${score}/${questions.length}
        (${percent}%)
        `;


    }

    else {


        feedback.className="error";


        feedback.innerHTML =
        `
        📚 Revision Needed.
        Score ${score}/${questions.length}
        (${percent}%)
        `;

    }



}








// =================================
// GRAND TEST TIMER
// =================================


let examTimer;


let totalSeconds =
30 * 60;






function startTimer(){



    const timer =
    document.getElementById(
        "mock-timer"
    );



    if(!timer) return;





    examTimer =
    setInterval(()=>{



        let minutes =
        Math.floor(
            totalSeconds / 60
        );



        let seconds =
        totalSeconds % 60;





        timer.textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;






        if(totalSeconds <= 0){


            clearInterval(examTimer);


            submitGrandTest();


        }



        totalSeconds--;



    },1000);



}











// =================================
// GRAND EXAM SUBMIT
// =================================



function submitGrandTest(){



    const form =
    document.getElementById(
        "grand-mock-test"
    );



    if(!form) return;





    clearInterval(examTimer);





    let score = 0;

    let attempted = 0;





    const answers =
    form.querySelectorAll(
        "input:checked"
    );





    answers.forEach(answer=>{


        attempted++;


        if(answer.value==="correct"){


            score++;


        }



    });







    const total = 15;



    const percentage =
    Math.round(
        score / total * 100
    );






    const result =
    document.getElementById(
        "test-results-box"
    );





    if(!result) return;






    let badge;



    if(percentage >= 50){


        badge =
        `
        <h1 class="success">
        PASS 🎉
        </h1>

        `;


    }

    else {


        badge =
        `
        <h1 class="error">
        RETAIN 📖
        </h1>

        `;

    }







    result.innerHTML =

    `

    ${badge}

    <h2>
    Your Result
    </h2>


    <p>

    Score:
    <strong>
    ${score}/${total}
    </strong>

    </p>



    <p>

    Percentage:
    <strong>
    ${percentage}%
    </strong>

    </p>



    <p>

    Attempted:
    ${attempted}/${total}

    </p>


    `;






    result.classList.remove(
        "hidden"
    );






    window.scrollTo({

        top:0,

        behavior:"smooth"

    });



}









// =================================
// PAGE START
// =================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    startTimer();


});
