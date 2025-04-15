$(document).ready(function () {
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
          url: 'questions.json',
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

          $(".option-box").each(function (i) {
               $(this).text(q.options[i]).off('click').on('click', () => {
                    hasAnswered = true;
                    nextQuestion();
               });
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
               $(".question-text").text("You’ve completed the quiz!");
               $(".option-box").hide();
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
});
