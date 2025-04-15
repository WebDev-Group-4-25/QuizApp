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
          let hasAnswered = false;

          let timer = new Timer(10, () => {
               if (!hasAnswered) {
                    hasAnswered = true;
                    nextQuestion();
               }
          });

          $.ajax({
               url: 'assets/data/questions.json',
               type: 'GET',
               dataType: 'json',
               success: function (data) {
                    questions = data;
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

          $(".next-button").click(() => {
               hasAnswered = true;
               nextQuestion();
          });

          $(".back-button").click(function () {
               if (current > 0) {
                    current--;
                    loadQuestion(current);
               }
          });
     }
});
