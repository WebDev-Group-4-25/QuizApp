$(document).ready(function () {

     $("#quiz-screen").hide();
     $(".play-again-btn").hide();
     $("#countdown-overlay").hide();
     $(".dark-overlay").hide();

     $("#start-button").click(function () {
          $("#entry-screen").fadeOut(300, function () {
               Timer.timerStarts(startQuiz);
          });
     });

     function startQuiz() {
          let questions = [];
          let current = 0;
          let score = 0;
          let streakValue = 0;
          let hasAnswered = false;

          let timer = new Timer(10, () => {
               if (!hasAnswered) {
                   resetStreak(); 
                   hasAnswered = true;
                   nextQuestion();
               }
          });

          $.ajax({
               url: 'assets/data/questions.json',
               type: 'GET',
               dataType: 'json',
               success: function (data) {
                    questions = shuffleArray(data);
                    loadQuestion(current);
               },
               error: function () {
                    alert("Failed to load questions.");
               }
          });

          function loadQuestion(index) {
               hasAnswered = false;
               const q = questions[index];
               $(".question-text").text(q.text);
               $(".number-question p").text((index + 1) + " / " + questions.length);
   
               OptionManager.render(q.options, (selectedIndex) => {
                   hasAnswered = true;
   
                   // Check if the selected answer is correct
                   if (selectedIndex === q.correctIndex) {
                       score++;
                       increaseStreak(); 
                   } else {
                       resetStreak(); 
                   }
   
                   nextQuestion();
               });
   
               timer.reset();
               timer.start();
          }

          function nextQuestion() {
               timer.stop();

               if (current < questions.length - 1) {
                    current++;
                    loadQuestion(current);
               } else {
                    $(".question-text").text("You've completed the quiz!");
                    OptionManager.hideAll();

                    $(".timer-bar").hide();
                    $(".options-con").hide();
                    $(".dark-overlay").show();
                    $(".play-again-btn").show();
               }
          }

          function shuffleArray(array) {
               for (let i = array.length - 1; i > 0; i--) {
                   const j = Math.floor(Math.random() * (i + 1));
                   [array[i], array[j]] = [array[j], array[i]];
               }
               return array;
          }

          function resetQuiz() {
               current = 0;
               score = 0;
               streak = 0;
               questions = shuffleArray(questions); // Reshuffle the questions
               $(".dark-overlay").hide();
               $(".play-again-btn").hide();
               $(".timer-bar").show();
               $(".options-con").show();
               loadQuestion(current); // Restart from the first question
          }

          function increaseStreak() {
               streakValue++;
               updateStreakCounter(streakValue);
               }
          
          function resetStreak() {
               streakValue = 0;
               updateStreakCounter(streakValue);
          }
          
          function updateStreakCounter(value) {
               $(".streak-counter p").text(value);
               $(".streak-counter").addClass("streak-update-animation");
               setTimeout(() => {
                    $(".streak-counter").removeClass("streak-update-animation");
               }, 300);
          }

          $(".next-button").click(() => {
               if (!hasAnswered) {
                   resetStreak(); 
               }
               hasAnswered = true;
               nextQuestion();
          });

          $(".play-again-btn").click(() => {
               resetQuiz();
          });
     }
});