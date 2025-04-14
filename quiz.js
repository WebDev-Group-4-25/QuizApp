$(document).ready(function () {
     let questions = [];
     let current = 0;
     let timerDuration = 10;  // Duration for each question's timer (10 seconds)
     let timerInterval;  // Variable to store the interval ID for clearing it

     // Load questions from the JSON file
     $.ajax({
          url: 'questions.json',  // URL of the JSON file
          type: 'GET',
          dataType: 'json',
          success: function (data) {
               questions = data;  // Store the questions in the 'questions' array
               loadQuestion(current);  // Load the first question
          },
          error: function () {
               alert("Failed to load questions.");
          }
     });

     // Load a specific question based on the current index
     function loadQuestion(index) {
          const q = questions[index];
          $(".question-text").text(q.text);
          $(".number-question p").text((index + 1) + " / " + questions.length);

          $(".option-box").each(function (i) {
               $(this).text(q.options[i]);
               $(this).off('click').on('click', function () {
                    nextQuestion();  // Move to the next question when an option is selected
               });
          });

          // Reset and start the timer for the new question
          resetTimer();
          startTimer();
     }

     // Reset the timer bar to initial state
     function resetTimer() {
          const timer = $(".timer-fill");
          timer.removeClass("orange red").addClass("white");
          timer.css({
               transform: "scaleX(0)",
               transition: "none"
          });

          // Force reflow to restart animation cleanly
          void timer[0].offsetWidth;
     }

     // Start the timer animation for 10 seconds
     function startTimer() {
          const timer = $(".timer-fill");
          let elapsedTime = 0;

          // Restart transition and animation
          timer.css({
               transition: "transform 10s linear, background-color 0.5s ease-in-out",
               transform: "scaleX(1)"
          });

          timer.removeClass("orange red").addClass("white");

          timerInterval = setInterval(function () {
               elapsedTime += 0.1;

               // Change color based on elapsed time
               timer.removeClass("white orange red");
               if (elapsedTime >= 8) {
                    timer.addClass("red");
               } else if (elapsedTime >= 5) {
                    timer.addClass("orange");
               } else {
                    timer.addClass("white");
               }
          }, 100);

          setTimeout(() => {
               clearInterval(timerInterval);
          }, timerDuration * 1000);
     }

     // Go to the next question
     function nextQuestion() {
          if (current < questions.length - 1) {
               current++;
               loadQuestion(current);
          } else {
               $(".question-text").text("You’ve completed the quiz!");
               $(".option-box").hide();  // Hide options after the last question
          }
     }

     // Next button functionality
     $(".next-button").click(nextQuestion);

     // Back button functionality
     $(".back-button").click(function () {
          if (current > 0) {
               current--;
               loadQuestion(current);
          }
     });
});
