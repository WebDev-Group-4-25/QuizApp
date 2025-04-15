class Timer {
     constructor(duration, onTimeout, onTick) {
          this.duration = duration;
          this.onTimeout = onTimeout;
          this.onTick = onTick;
          this.interval = null;
          this.timeout = null;
          this.elapsedTime = 0;
          this.timerEl = $(".timer-fill");
     }

     reset() {
          this.timerEl.removeClass("orange red").addClass("white");
          this.timerEl.css({ transform: "scaleX(0)", transition: "none" });
          clearInterval(this.interval);
          clearTimeout(this.timeout);
          void this.timerEl[0].offsetWidth;
     }

     start() {
          this.elapsedTime = 0;
          this.timerEl.css({
               transition: `transform ${this.duration}s linear, background-color 0.5s ease-in-out`,
               transform: "scaleX(1)"
          }).removeClass("orange red").addClass("white");

          this.interval = setInterval(() => {
               this.elapsedTime += 0.1;
               if (this.onTick) this.onTick(this.elapsedTime);

               this.timerEl.removeClass("white orange red");
               if (this.elapsedTime >= 8) this.timerEl.addClass("red");
               else if (this.elapsedTime >= 5) this.timerEl.addClass("orange");
               else this.timerEl.addClass("white");
          }, 100);

          this.timeout = setTimeout(() => {
               clearInterval(this.interval);
               if (this.onTimeout) this.onTimeout();
          }, this.duration * 1000);
     }

     stop() {
          clearInterval(this.interval);
          clearTimeout(this.timeout);
     }

     static timerStarts(callback) {
          const $overlay = $("#countdown-overlay");
          const $number = $("#countdown-number");

          $overlay.show();
          let countdown = 3;

          function showNextNumber() {
               if (countdown === 0) {
                    $overlay.fadeOut(300, () => {
                         $("#quiz-screen").fadeIn(300);
                         callback();
                    });
                    return;
               }

               $number.hide().text(countdown).fadeIn(300).delay(400).fadeOut(300, () => {
                    countdown--;
                    showNextNumber();
               });
          }
          showNextNumber();
     }
}