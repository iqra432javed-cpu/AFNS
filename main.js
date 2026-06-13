

/* =====================================================
   IMORIA LEARNING
   AFNS Chemistry Portal Logic
===================================================== */



// ================================
// CHAPTER QUIZ CHECKER
// ================================


function checkChapterQuiz(chapterNum){



const form =
document.querySelector(
`form[data-chapter="${chapterNum}"]`
);



if(!form) return;




const questions =
[
...new Set(
[...form.querySelectorAll("input")]
.map(input=>input.name)
)
];





let score = 0;

let attempted = 0;





questions.forEach(question=>{


const selected =
form.querySelector(
`input[name="${question}"]:checked`
);



if(selected){


attempted++;



if(selected.value==="correct"){

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
⚠ Complete all questions first.
<br>
Attempted ${attempted}/${questions.length}
`;



return;



}







let percent =
Math.round(
(score/questions.length)*100
);






if(percent >= 50){


feedback.className="success";


feedback.innerHTML =
`
🎉 Passed Chapter Quiz

<br>

Score:
${score}/${questions.length}

<br>

${percent}%

`;



}

else{


feedback.className="error";


feedback.innerHTML =
`
📚 Need Revision

<br>

Score:
${score}/${questions.length}

<br>

${percent}%

`;

}



}









// ================================
// MOCK TIMER
// ================================



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
totalSeconds/60
);



let seconds =
totalSeconds % 60;





timer.textContent =

`${String(minutes).padStart(2,"0")}:
${String(seconds).padStart(2,"0")}`;








if(totalSeconds <= 0){



clearInterval(examTimer);



submitGrandTest();


return;


}




totalSeconds--;




},1000);




}









// ================================
// GRAND MOCK SUBMISSION
// ================================



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








const totalQuestions = 50;





const percentage =

Math.round(
(score/totalQuestions)*100
);







const resultBox =
document.getElementById(
"test-results-box"
);





if(!resultBox) return;








let status;





if(percentage >= 50){



status =
`
<h1 class="success">
PASS 🎉
</h1>

<p>
Excellent AFNS preparation level.
</p>

`;



}

else{


status =
`
<h1 class="error">
RETAIN 📖
</h1>

<p>
Revise weak chapters and try again.
</p>

`;



}







resultBox.innerHTML =

`

${status}


<h2>
Grand Test Result
</h2>


<p>

Score:
<strong>
${score}/${totalQuestions}
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
${attempted}/${totalQuestions}

</p>


`;






resultBox.classList.remove(
"hidden"
);






window.scrollTo({

top:0,

behavior:"smooth"

});




}









// ================================
// PAGE LOAD
// ================================



document.addEventListener(
"DOMContentLoaded",
()=>{


startTimer();



});
