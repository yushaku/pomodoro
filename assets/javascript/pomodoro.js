const titleH1 = $(".titleH1");
const btnStart = $(".btnStart");
const btnContinue = $(".btnContinue");
const btnExit = $(".btnExit");



const config = JSON.parse(localStorage.getItem("POMODORO_SETTING")) || [];
let studyTime = config.studyTime ?? 25;
let breakTime = config.breakTime ?? 5;
let longBreakTime = config.longBreakTime ?? 15;
let countSession = 0;
let LongbreakInterval = config.LongbreakInterval ?? 4;
let isAutoStudy = config.autoStartStudy ?? false;
let isAutoBreak = config.autoStartBreak ?? false;


const clock = $(".clock").FlipClock(0, {
   clockFace: "MinuteCounter",
   countdown: true,
   autoStart: false,
   callbacks: {
      interval: function () {
         if (clock.getTime() == 0) {
            if (titleH1.html() == "session") {
               countSession++;
               $("#pip").play();
               workDoneSection(document.querySelector('#pomodoroTask p').getAttribute('id-work') ?? 0);

               if (countSession == LongbreakInterval) {
                  countSession = 0;
                  titleH1.html("long break");
                  clock.setTime(longBreakTime * 60 +1);
                  btnStart.html("start");
                  isAutoBreak ? clock.start() : clock.stop();
               } else {
                  clock.setTime(breakTime * 60 + 1);
                  isAutoBreak ? clock.start() : clock.stop();
                  titleH1.html("break");
                  btnStart.html("start");
               }
            } else if (titleH1.html() == "break") {
               clock.setTime(studyTime * 60 +1);
               titleH1.html("session");
               btnStart.html("start");
               pip.play();
               isAutoStudy ? clock.start() : clock.stop();
            } else {
               clock.setTime(studyTime * 60+1);
               titleH1.html("session");
               pip.play();
               isAutoStudy ? clock.start() : clock.stop();
            }
         }
      },
   },
});
clock.setTime(studyTime * 60);


btnStart.on("click", function () {
   if (btnStart.html() == "start") {
      if(titleH1.html() == "pomodoro"){
         btnStart.html("pause");
         titleH1.html("session");
         clock.start();
      }
      else{
         btnStart.html("pause");
         clock.start();
      }
   } else if (btnStart.html() == "pause") {
      clock.stop();
      btnStart.removeClass("display");
      btnContinue.addClass("display");
      btnExit.addClass("display");
   }
});
btnContinue.on("click", function () {
   clock.start();
   btnStart.addClass("display");
   btnContinue.removeClass("display");
   btnExit.removeClass("display");
});
btnExit.on("click", function () {
   clock.setTime(studyTime * 60);
   btnStart.html("start");
   btnStart.addClass("display");
   btnContinue.removeClass("display");
   btnExit.removeClass("display");
});