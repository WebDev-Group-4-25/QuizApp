let hasAnswered = false;

$(document).ready(function () {
     let questions = [];
     let current = 0;
     let timerDuration = 10;
     let timerInterval;
     let timerTimeout; 

     // AJAX Implementation: Load questions from the JSON file
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

     // Load a specific question based on the current index
     function loadQuestion(index) {
          hasAnswered = false;

          const q = questions[index];
          $(".question-text").text(q.text);
          $(".number-question p").text((index + 1) + " / " + questions.length);

          $(".option-box").each(function (i) {
               $(this).text(q.options[i]).off('click').on('click', nextQuestion);
          });

          // Reset and start the timer for the new question
          resetTimer();
          startTimer();
     }

     // Reset the timer bar to initial state
     function resetTimer() {
          const timer = $(".timer-fill");
          timer.removeClass("orange red").addClass("white");
          timer.css({ transform: "scaleX(0)", transition: "none" });
          
          clearInterval(timerInterval);
          clearTimeout(timerTimeout);

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
          }).removeClass("orange red").addClass("white");

          timerInterval = setInterval(function () {
               elapsedTime += 0.1;

               // Change color based on elapsed time
               timer.removeClass("white orange red");
               if (elapsedTime >= 8) timer.addClass("red");
               else if (elapsedTime >= 5) timer.addClass("orange");
               else timer.addClass("white");
          }, 100);

          timerTimeout = setTimeout(() => {
               clearInterval(timerInterval); 
               if (!hasAnswered) {
                    hasAnswered = true;
                    nextQuestion();
               }
          }, timerDuration * 1000);
     }

     // Go to the next question
     function nextQuestion() {
          if (current < questions.length - 1) {
               current++;
               loadQuestion(current);
          } else {
               $(".question-text").text("You’ve completed the quiz!");
               $(".option-box").hide(); 
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