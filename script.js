function showBubble(text, typingDelay = 1500, stayDuration = 4000) {
     const bubbleWrapper = document.querySelector('.avatar-bubble-chat');
     const bubble = document.querySelector('.bubble-chat');
     const textSpan = document.querySelector('.bubble-text');
     const tailLarge = document.querySelector('.bubble-tail-large');
     const tailSmall = document.querySelector('.bubble-tail-small');

     textSpan.textContent = "";

     bubbleWrapper.classList.remove('show');
     bubble.classList.remove('show');
     tailLarge.classList.remove('show');
     tailSmall.classList.remove('show');

     // Reset width to 0 for animation
     bubble.style.width = "0px";
     bubble.style.opacity = "0";

     // Step 1: Animate tails
     setTimeout(() => {
          tailSmall.classList.add('show');
          setTimeout(() => {
               tailLarge.classList.add('show');

               // Step 2: Show bubble with "typing..." dots
               setTimeout(() => {
                    const dots = ["", ".", "..", "..."];
                    let i = 0;
                    bubble.classList.add('show');

                    const dotInterval = setInterval(() => {
                         textSpan.textContent = dots[i % dots.length];
                         i++;
                    }, 300);

                    // Step 3: After typingDelay, show final text and resize bubble
                    setTimeout(() => {
                         clearInterval(dotInterval);
                         textSpan.textContent = text;

                         // Measure text size
                         const temp = document.createElement("span");
                         temp.style.position = "absolute";
                         temp.style.visibility = "hidden";
                         temp.style.whiteSpace = "nowrap";
                         temp.style.font = getComputedStyle(textSpan).font;
                         temp.textContent = text;
                         document.body.appendChild(temp);

                         const textWidth = temp.offsetWidth + 40; // padding
                         document.body.removeChild(temp);

                         bubble.style.width = `${textWidth}px`;
                         bubble.style.opacity = "1";

                         // Step 4: Optional auto-hide
                         setTimeout(() => {
                              bubbleWrapper.classList.remove('show');
                              bubble.classList.remove('show');

                              // Reset width to 0 to collapse it smoothly
                              bubble.style.width = "0px";
                              bubble.style.opacity = "0";
                              tailLarge.classList.remove('show');
                              tailSmall.classList.remove('show');
                         }, stayDuration);
                    }, typingDelay);
               }, 150);
          }, 100);
     }, 100);
}
