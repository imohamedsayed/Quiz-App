// select html elements
let countSpan = document.querySelector(".quizInfo .count span");
let bullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quizArea");
let answersArea = document.querySelector(".answersArea");
let submitBtn = document.querySelector(".submitBtn");
let bbs = document.querySelector(".bullets");
let resultsC = document.querySelector(".results");
let countDownElement = document.querySelector(".countDown");
let currIndex = 0;
let grade = 0;
let countDownInterval;

function getQestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      //console.log(myRequest.responseText);
      let questions = JSON.parse(this.responseText);
      createBullets(questions.length);
      addQuestion(questions[currIndex], questions.length);
      countDown(5, questions.length);
      submitBtn.onclick = () => {
        let rightAnwser = questions[currIndex].right_answer;
        currIndex++;
        //checking
        checkAnwser(rightAnwser, questions.length);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestion(questions[currIndex], questions.length);
        handleBullets();
        clearInterval(countDownInterval);
        showResults(questions.length);
        countDown(5, questions.length);
      };
    }
  };

  myRequest.open("GET", "../htmlQ.json", true);

  myRequest.send();
}

getQestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i == 0) {
      bullet.classList.add("on");
    }
    bullets.appendChild(bullet);
  }
}

function addQuestion(obj, cout) {
  if (currIndex < cout) {
    // create quetion title
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj.title);
    qTitle.appendChild(qText);
    quizArea.appendChild(qTitle);

    //answers

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      // create radio input

      let radio = document.createElement("input");
      radio.name = "question";
      radio.type = "radio";
      radio.id = `answer_${i}`;
      radio.dataset.answer = obj[`answer_${i}`];

      //label

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      mainDiv.appendChild(radio);
      mainDiv.appendChild(label);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnwser(right, count) {
  let answers = document.getElementsByName("question");
  let chonsenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chonsenAnswer = answers[i].dataset.answer;
    }
  }
  if (right === chonsenAnswer) {
    grade++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  bulletsSpans = Array.from(bulletsSpans);

  bulletsSpans.forEach((span, index) => {
    if (index === currIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let results;
  if (currIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bbs.remove();

    if (grade > count / 2 && grade < count) {
      results = `<span class=good>Good</span>, ${grade} From ${count} `;
    } else if (grade == count) {
      results = `<span class=perfect>Perfect</span>, All Answers Right !`;
    } else {
      results = `<span class=bad>Bad</span>, ${grade} From ${count} `;
    }

    resultsC.innerHTML = results;
    resultsC.style.padding = "20px";
    resultsC.style.backgroundColor = "white";
    resultsC.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currIndex < count) {
    let min, sec;
    countDownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      countDownElement.innerHTML = `
      ${min} : ${sec}
      `;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
