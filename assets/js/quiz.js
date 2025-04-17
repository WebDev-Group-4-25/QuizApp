$(document).ready(function () {
     $("#quiz-screen").hide();
     $(".play-again-btn").hide();
     $("#countdown-overlay").hide();
     $(".dark-overlay").hide();
 
     $("#start-button").click(function () {
         $("#entry-screen").fadeOut(300, function () {
             Timer.timerStarts(startQuiz);
         });
         music.volume = 0.25;
         clappingSound.volume = 0.25;
         music.play();
     });
 
     const positiveMessages = [
         "Great job! 🎉",
         "You nailed it! 🌟",
         "Keep it up! 👍",
         "Correct! 💯",
         "You're on fire! 🔥"
     ];
 
     const negativeMessages = [
         "Better luck next time! 🙁",
         "Oops, that's incorrect. 😔",
         "Don't give up! Try the next one! 💪",
         "Not quite right. Give it another shot! ✨",
         "You'll get it next time! 🔄"
     ];
 
     const completionMessage = "Congratulations! You've completed the quiz! 🎊";
 
     const music = document.getElementById("background-music");
     const clappingSound = document.getElementById("clapping-sound");
     const muteButton = document.getElementById("mute-button");
 
     /* Mute/Unmute toggle */
     muteButton.addEventListener("click", function () {
         if (music.muted) {
             music.muted = false;
             muteButton.textContent = "Mute";
         } else {
             music.muted = true;
             muteButton.textContent = "Unmute";
         }
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
 
             $(".option-box").removeClass("option-correct option-incorrect option-disabled");
 
             const q = questions[index];
             $(".question-text").text(q.text);
             $(".number-question p").text((index + 1) + " / " + questions.length);
 
             OptionManager.render(q.options, (selectedIndex) => {
                 hasAnswered = true;
 
                 const options = $(".option-box");
 
                 options.each((index, option) => {
                     if (index === selectedIndex) {
                         if (index === q.correctIndex) {
                             score++;
                             increaseStreak();
                             showAvatarMessage(true);
                         } else {
                             $(option).addClass("option-incorrect");
                             resetStreak();
                             showAvatarMessage(false);
                         }
                     }
 
                     if (index === q.correctIndex) {
                         $(option).addClass("option-correct");
                     }
 
                     $(option).addClass("option-disabled");
                 });
 
                 setTimeout(() => {
                     nextQuestion();
                 }, 2000);
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
                 $(".question-text").html(`You've completed the quiz!<br><br>Your Score: ${score} / ${questions.length}`);
 
                 OptionManager.hideAll();
 
                 $(".timer-bar").hide();
                 $(".options-con").hide();
                 $(".dark-overlay").show();
                 $(".play-again-btn").show();
 
                 showCompletionMessage(score, questions.length);
                 music.pause();
                 playClappingSound();
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
             questions = shuffleArray(questions);
             $(".dark-overlay").hide();
             $(".play-again-btn").hide();
             $(".timer-bar").show();
             $(".options-con").show();
             loadQuestion(current);
             resetAvatarMessage();
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
 
         function showAvatarMessage(isCorrect) {
             const bubble = $(".bubble-chat");
             const bubbleText = $(".bubble-text");
 
             const message = isCorrect
                 ? positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
                 : negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
 
             bubbleText.text(message);
             bubble.addClass("show");
 
             setTimeout(() => {
                 bubble.removeClass("show");
             }, 2000);
         }
 
         function showCompletionMessage(score, totalQuestions) {
             const bubble = $(".bubble-chat");
             const bubbleText = $(".bubble-text");
 
             bubbleText.text(completionMessage);
             bubble.addClass("show");
         }
 
         function resetAvatarMessage() {
             const bubble = $(".bubble-chat");
             const bubbleText = $(".bubble-text");
 
             bubbleText.text("Hi there! 👋🏻");
             bubble.removeClass("show");
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
 
         function playClappingSound() {
             clappingSound.play();
         }
     }
 }); 