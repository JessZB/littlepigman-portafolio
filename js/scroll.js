// function smoothScrool(target,duration){
//     var target = document.querySelector(target);
//     var targetPosition = target.getBoundingClientRect().top;
//     var startPosition = window.scrollY;
//     var distance = targetPosition - startPosition;
//     var startTime = null;


//     function animation(currentTime){
//         if(startTime === null) startTime = currentTime;
//         var timeElapsed = currentTime - startTime;
//         var run = ease(timeElapsed, startPosition, distance, duration);
//         window.scrollTo(0, run);
//         if(timeElapsed < duration) requestAnimationFrame(animation);
//     }

//     function ease(t, b, c, d) {
//         t /= d/2;
//         if (t < 1) return c/2*t*t*t + b;
//         t -= 2;
//         return c/2*(t*t*t + 2) + b;
//     }

//     requestAnimationFrame(animation)
// }
    
// const tosection1 = document.querySelector('.works1');
// tosection1.addEventListener('click', () =>{
//     window.scrollTo(0, )
// });
// const tosection2 = document.querySelector('.skills1');
// tosection2.addEventListener('click', () =>{
//     smoothScrool('.skills', 1000);
// });
// const tosection3 = document.querySelector('.about1');
// tosection3.addEventListener('click', () =>{
//     smoothScrool('.about', 1000);
// });
// const tosection4 = document.querySelector('.contact1');
// tosection4.addEventListener('click', () =>{
//     smoothScrool('.contact', 1000);
// });

