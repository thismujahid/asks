// Elements
let questionsCount = document.querySelector(".count span");
let countdownElement = document.querySelector(".countdown");
let content = document.querySelector(".conent");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let bullitsContainer = document.querySelector(".bullets .spans");
let results = document.querySelector(".results");
// Options
let curentIndex = 0;
let rightAnswerCount = 0;
let countdownInterval;
// XML HTTP Rquest To Get Json File For Questions
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let jsonToJsObject = JSON.parse(this.responseText);

      let myQuestionsCoune = jsonToJsObject.length;

      questionsCounter(myQuestionsCoune);

      getQuestionsData(jsonToJsObject[curentIndex], myQuestionsCoune);

      countdown(60, myQuestionsCoune);

      submitBtn.onclick = function () {
        let rightAnswer = jsonToJsObject[curentIndex].right_answer;

        curentIndex++;

        handelBullitsActive();

        checkRightAnswer(rightAnswer, myQuestionsCoune);

        quizArea.innerHTML = "";

        answersArea.innerHTML = "";

        showResults(myQuestionsCoune);

        getQuestionsData(jsonToJsObject[curentIndex], myQuestionsCoune);

        clearInterval(countdownInterval);

        countdown(60, myQuestionsCoune);
      };
    }
  };
  myRequest.open("GET", "asks.json", true);

  myRequest.send();
}
getQuestions();

// Start Functions Area

// Count Off Question To Append Count In DOM Tree
function questionsCounter(num) {
  questionsCount.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullitsSpan = document.createElement("span");

    if (i === 0) {
      bullitsSpan.className = "on";
    }
    bullitsContainer.appendChild(bullitsSpan);
  }
}
// Get Question Data From Json File and Append Him In DOM tree
function getQuestionsData(obj, count) {
  let myH2 = document.createElement("h2");

  let myH2Text = document.createTextNode(obj.title);

  myH2.appendChild(myH2Text);

  quizArea.appendChild(myH2);

  for (let i = 1; i <= 4; i++) {
    let myAnswer = document.createElement("div");

    myAnswer.className = "answers";

    let myRadio = document.createElement("input");

    myRadio.type = "radio";

    myRadio.name = "question";

    myRadio.id = `answer_${i}`;

    myRadio.dataset.answer = obj[`answers_${i}`];

    let label = document.createElement("label");

    label.setAttribute("for", `answer_${i}`);

    let labelText = document.createTextNode(obj[`answers_${i}`]);

    label.appendChild(labelText);

    myAnswer.appendChild(myRadio);

    myAnswer.appendChild(label);

    answersArea.appendChild(myAnswer);
  }
}
// Check Right Answers
function checkRightAnswer(rAnswer, objCount) {
  let myAnswers = document.getElementsByName("question");

  let theAnswerchecked;

  for (let i = 0; i < myAnswers.length; i++) {
    if (myAnswers[i].checked) {
      theAnswerchecked = myAnswers[i].dataset.answer;
    }
  }
  if (rAnswer === theAnswerchecked) {
    rightAnswerCount++;
  }
}
// Create BUllits and Handling Him and Add To Dom Tree
function handelBullitsActive() {
  let allBullites = document.querySelectorAll(".bullets .spans span");

  let array = Array.from(allBullites);

  array.forEach(function (span, index) {
    if (curentIndex === index) {
      span.className = "on";
    }
  });
}
// Calcuting Resultes and Append Him in DOM After Remove Content Element From DOM
function showResults(count) {
  let theResults;

  if (count === curentIndex) {
    content.remove();

    clearInterval(countdownInterval);

    countdownElement.innerHTML = "انتهت الاسئله";

    results.style.display = "block";

    if (rightAnswerCount > count / 2 && rightAnswerCount < count) {
      theResults = `<span class="good">جيد </span> لقد اجبت علي ${rightAnswerCount} من ${count} اسئله <span class="try" onclick="goToHome()"> الرئيسية؟ </span> <a href="http://aloroby.atwebpages.com" class="url"></a>`;
    } else if (rightAnswerCount === count) {
      theResults = `<span class="perfect">عظيم</span> لقد أجبت علي جميع الاسئله <span class="try" onclick="goToHome()"> الرئيسية؟ </span>  <a href="http://aloroby.atwebpages.com" class="url"></a>`;
    } else {
      theResults = `<span class="bad">سئ</span>  لقد اجبت علي ${rightAnswerCount} من ${count} أسئله <span class="try" onclick="location.reload()">حاول مره اخري</span>`;
    }

    results.innerHTML = theResults;
  }
}
// Timer Function
function countdown(duration, count) {
  if (curentIndex < count) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);

      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;

      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);

        submitBtn.click();
      }
    }, 1000);
  }
}

function goToHome() {
  let url = document.querySelector(".results .url");

  url.click();
}
