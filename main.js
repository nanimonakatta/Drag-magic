import { pickRandomCard } from "./cardArr.js";

const main = document.querySelector('.main');
const theCursor = document.querySelector('.cursor');
const select = document.getElementById('play-type')
const mobileQuery = window.matchMedia('(max-width: 500px)');
const playType = ['Cards falling', 'Boxes zooming in'];
let selectedOption = ['Cards falling'];
let isMousePressed = false;
let isMousePressedOnce = false;
let isMouseUp = false;
let isMouseMoving = false;
let isTouched = false;
let creatingBooVal = false;
let timeoutIdC;
let timeoutIdD;
let timeoutId;
let dur = 0.8;

function createOptions() {
   let selectHTML = '';
   playType.forEach((option) => {
      selectHTML += `
         <option value="${option}" class="play-type-option">
            ${option}
         </option> 
      `;
   });
   select.innerHTML = selectHTML;
}

select.addEventListener('change', function() {
   selectedOption[0] = select.value;
})

defaultThings();
function defaultThings() {
   main.addEventListener('mousemove', trackCursor);
   mobileQuery.addEventListener('change', mediaQueries);
   createOptions();
   touchScene();
   addMouseDown();
}

function addMouseDown() {
   main.addEventListener('mousedown', handleMouseDown);
}

function handleMouseDown(event) {
   isMousePressedOnce = true;
   isMousePressed = true;
   createDivs(event.clientX, event.clientY);
   if (isMousePressedOnce) {
      main.addEventListener('mouseup', handleMouseUp);
      isMouseUp = false;
   }
   main.addEventListener('mousemove', handleMouseMove);  
   timeoutForC();
}

function timeoutForC() {
   timeoutIdC = setInterval(function() {
      creatingBooVal = true;
   }, 50);
}

function handleMouseMove(event) {
   if (isMousePressed) {
      if (creatingBooVal) {
         createDivs(event.clientX, event.clientY);
         creatingBooVal = false;
         isMouseMoving = true;
      }
   }  
   mouseDoesntMove(event.clientX, event.clientY);
}

function mouseDoesntMove(x, y) {
   if (isMouseMoving && isMousePressed || isTouched) {
      clearInterval(timeoutId);
      timeoutId = setInterval(function() {
         createDivs(x, y);
      }, 50);
   }
}

function handleMouseUp() {
   clearTimeout(timeoutIdD);
   isMouseUp = true;
   isMousePressed = false;
   isMouseMoving = false;
   clearInterval(timeoutId);
   main.removeEventListener('mousemove', handleMouseMove);
   main.removeEventListener('mouseup', handleMouseUp);
   clearTimeout(timeoutIdC);
}

function createRandomColors() {
   const color = 'ABCDEF0123456789';
   let colorCode = '#'
   for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 16);
      colorCode += color[randomNumber];
   }
   return colorCode;
}

function createDivs(x, y) {
   let img;
   let box;
   if (selectedOption[0] === 'Cards falling') {
      clearTimeout(timeoutIdD);
      img = document.createElement('img');
      img.classList.add('image');
      main.append(img);
      img.style.top = `${y}px`;
      img.style.left = `${x}px`;
      img.src = pickRandomCard();
      img.loading = 'eager';
   } else if (selectedOption[0] === 'Boxes zooming in') {
      box = document.createElement('div');
      box.classList.add('box-div');
      main.append(box);
      box.style.top = y - box.clientHeight / 2 + 'px';
      box.style.left = x - box.clientWidth / 2 + 'px';
      box.style.backgroundColor = createRandomColors();
   }
   gsapAnimation(img, box);
}

function trackCursor(event) {
   let x = event.clientX;
   let y = event.clientY;

   if (theCursor.clientWidth +  x > main.clientWidth) {
      x = main.clientWidth - (theCursor.clientWidth);
   } else if (x - theCursor.clientWidth < 0) {
      x = theCursor.clientWidth / 2;
   }
   if (theCursor.clientHeight +  y > main.clientHeight) {
      y = main.clientHeight - (theCursor.clientHeight);
   } else if (y - theCursor.clientHeight < 0) {
      y = theCursor.clientHeight / 2;
   }

   theCursor.style.top = `${y - theCursor.clientWidth / 2}px`;
   theCursor.style.left = `${x - theCursor.clientHeight / 2}px`;

   document.body.addEventListener('mouseenter', function() {
      theCursor.style.opacity = 1;
   })
   document.body.addEventListener('mouseleave', function() {
      theCursor.style.opacity = 0;
   })
}

function touchScene() {
   main.addEventListener('touchmove', function(event) {
      isTouched = true;
      createDivs(event.touches[0].clientX, event.touches[0].clientY);
      if (isTouched) {
         mouseDoesntMove(event.touches[0].clientX, event.touches[0].clientY);
      }
   });
   
   main.addEventListener('touchend',function() {
      clearInterval(timeoutId);
      isTouched = false;
   });
}

function mediaQueries() {
   if (mobileQuery.matches) {
      dur = 2;
   } else {
      dur = 0.8; 
   }
}

function gsapAnimation(img, box) {
   if (selectedOption[0] === 'Cards falling') {
      gsap.to('.image', {
         top: '110%',
         duration: dur,
         delay: 0.2,
         onComplete: function() {
            img.remove();
         }
      })
   } else if (selectedOption[0] === 'Boxes zooming in') {
      gsap.to('.box-div', {
         width: '20vw',
         height: '20vw',
         x: 0,
         y: 0,
         duration: 1
      })
      gsap.to('.box-div', {
         opacity: 0,
         duration: 1,
         delay: 0.4,
         onComplete: function() {
            box.remove();
         }
      })
   }
}