import { myBackgrounds } from "./data.js";

const bgSetting = $(".backgroundSetting");
const pomodoro = $(".pomodoro");
const settingBlock = $("#setting");
const studyTimeInput = $("#studyTime");
const breakTimeInput = $("#breakTime");
const longBreakTimeInput = $("#longBreakTime");
const autoStartBreak = $("#autoStartBreak");
const autoStartStudy = $("#autoStartStudy");
const breakInervalInput = $("#breakInerval");

const backgrounds = myBackgrounds;
const POMODORO_SETTING = "POMODORO_SETTING";
let pomodoroConfig = {};

(function runSetting() {
   renderTheme();
   renderVideoList();
   handleEvent();
   setDefault(POMODORO_SETTING);
})();

function renderTheme() {
   let themeitem = backgrounds.map((bg) => {
      if (bg.type == "img") {
         return `
         <div class="themeItem">
            <div class="img" style="background: rgba(51, 51, 51, 0.205) url(${bg.path}) no-repeat top left;"></div>
            <p>${bg.title} </p>
         </div>
         `;
      }
   });
   $(".themeList").html(themeitem);
}
function renderVideoList() {
   let themeitem = backgrounds.map((bg) => {
      if (bg.type == "video") {
         return `
         <div class="themeItem">
         <video
            src="${bg.path}"
            type="video/mp4"
            loop muted autoplay
         ></video>
            <p>${bg.title} </p>
         </div>
         `;
      }
   });
   $(".videoList").html(themeitem);
}
function handleEvent() {
   const feature = $(".feature");

   // feature.each((index, element) => {
   //    element.onclick = () => {
   //       element.classList.toggle("openFeature");
   //    };
   // });

   $(".featureTodo").click(() => {
      openTodo();
   });

   $(".featureBG").click(() => {
      openBackGround();
   });

   $(".featureSong").click(() => {
      openMusic();
   });

   $(".themeItem").each((index, item) => {
      item.onclick = () => {
         console.log(item.innerHTML);
         $("#banner").html(item.innerHTML);
         bgSetting.removeClass("bgSettingOpen");
         feature[1].classList.remove("openFeature");
         pomodoro.removeClass("pomodoroClose");
      };
   });

   $(".settingBtn").click(() => {
      openSetting()
   });

   $(".apply").click((e) => {
      e.preventDefault();

      pomodoroConfig.studyTime = studyTimeInput.val();
      pomodoroConfig.breakTime = breakTimeInput.val();
      pomodoroConfig.longBreakTime = longBreakTimeInput.val();
      pomodoroConfig.autoStartBreak = autoStartBreak.is(":checked");
      pomodoroConfig.autoStartStudy = autoStartStudy.is(":checked");
      pomodoroConfig.LongbreakInterval = breakInervalInput.val();

      alert("ok");
      settingBlock.removeClass("settingOpen");
      addToLocalStorage(POMODORO_SETTING, pomodoroConfig);
      setDefault();
   });

   document.addEventListener(
      "keydown",
      (event) => {
         var name = event.key;
         var code = event.code;
         //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
         if (name === "t") {
            openTodo();
         }
         else if(name == 'm'){
            openMusic()
         }
         else if(name == 'b'){
            openBackGround()
         }
         else if(name =='s'){
            openSetting()
         }
      },
      false
   );
}
function setDefault(key) {
   studyTimeInput.val(getDataFromLocalStorage(key).studyTime ?? studyTime);
   breakTimeInput.val(getDataFromLocalStorage(key).breakTime ?? breakTime);
   longBreakTimeInput.val(getDataFromLocalStorage(key).longBreakTime ?? longBreakTime);
   breakInervalInput.val(getDataFromLocalStorage(key).LongbreakInterval ?? LongbreakInterval);
   autoStartBreak.prop("checked", getDataFromLocalStorage(key).autoStartBreak ?? isAutoBreak);
   autoStartStudy.prop("checked", getDataFromLocalStorage(key).autoStartStudy ?? isAutoStudy);
}
function openTodo() {
   $(".todo").toggleClass("openTodo");
   if (window.outerWidth <= 775) {
      pomodoro.toggleClass("pomodoroClose");
   }
}
function openBackGround() {
   bgSetting.toggleClass("bgSettingOpen");
   pomodoro.toggleClass("pomodoroClose");
}
function openMusic() {
   $(".musicBlock").toggleClass("musicOpen");
   settingBlock.removeClass("settingOpen");
   if (window.outerWidth <= 775) {
      pomodoro.toggleClass("pomodoroClose");
   }
}
function openSetting(){
   settingBlock.toggleClass("settingOpen");
      $(".musicBlock").removeClass("musicOpen");
}
