const feature = $$(".feature");
const featureTodo = $(".featureTodo");
const featureBG = $(".featureBG");
const featureSong = $(".featureSong");

const banner = $("#banner");
const todo = $(".todo");
const musicBlock = $(".musicBlock");
const bgSetting = $(".backgroundSetting");
const pomodoro = $(".pomodoro");
const settingBtn = $(".settingBtn");
const settingBlock = $("#setting");

const studyTimeInput = $("#studyTime");
const breakTimeInput = $("#breakTime");
const longBreakTimeInput = $("#longBreakTime");
const autoStartBreak = $("#autoStartBreak");
const autoStartStudy = $("#autoStartStudy");
const breakInervalInput = $("#breakInerval");
const applyBtn = $(".apply");


const POMODORO_SETTING = "POMODORO_SETTING";

const bgConfig = {
   config: JSON.parse(localStorage.getItem(POMODORO_SETTING)) || {},

   setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(POMODORO_SETTING, JSON.stringify(this.config));
   },
   backgrounds: [
      {
         type: "img",
         title: "rose",
         path: "./assets/img/rose.jpg",
      },
      {
         type: "img",
         title: "jennie",
         path: "./assets/img/jennie.jpg",
      },
      {
         type: "img",
         title: "lisa",
         path: "./assets/img/lisa.jpg",
      },
      {
         type: "img",
         title: "jisoo",
         path: "./assets/img/jisoo.jpg",
      },
      {
         type: "img",
         title: "iu",
         path: "./assets/img/iu.jpg",
      },
      {
         type: "video",
         title: "nature",
         path: "./assets/img/video1.mp4",
         video: "./assets/img/video1.mp4",
      },
      {
         type: "video",
         title: "nature",
         path: "./assets/img/video2.mp4",
         video: "./assets/img/video2.mp4",
      },
      {
         type: "video",
         title: "suối chảy",
         path: "./assets/img/video3.mp4",
         video: "./assets/img/video3.mp4",
      },
      {
         type: "video",
         title: "hoàng hôn",
         path: "./assets/img/video4.mp4",
         video: "./assets/img/video4.mp4",
      },
      {
         type: "video",
         title: "code with me",
         path: "./assets/img/video5.mp4",
         video: "./assets/img/video5.mp4",
      },
   ],
   renderTheme: function () {
      const themeitem = this.backgrounds.map((bg) => {
         if (bg.type == "img") {
            return `
            <div class="themeItem">
               <div class="img" style="background: rgba(51, 51, 51, 0.205) url(${bg.path}) no-repeat top left;"></div>
               <p>${bg.title} </p>
            </div>
            `;
         }
      });
      const themeList = $(".themeList");
      themeList.innerHTML = themeitem.join("");
   },
   renderVideoList: function () {
      const themeitem = this.backgrounds.map((bg) => {
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
      const videoList = $(".videoList");
      videoList.innerHTML = themeitem.join("");
   },

   hanldeEvent: function () {
      const themeItem = $$(".themeItem");
      _this = this;
      feature.forEach((element) => {
         element.onclick = function () {
            element.classList.toggle("openFeature");
         };
      });

      featureTodo.onclick = function () {
         todo.classList.toggle("openTodo");
         if (window.outerWidth <= 775) {
            pomodoro.classList.toggle("pomodoroClose");
         }
      };

      featureBG.onclick = function () {
         bgSetting.classList.toggle("bgSettingOpen");
         pomodoro.classList.toggle("pomodoroClose");
      };

      featureSong.onclick = function () {
         musicBlock.classList.toggle("musicOpen");
         if (window.outerWidth <= 775) {
            pomodoro.classList.toggle("pomodoroClose");
         }
      };
      themeItem.forEach((item) => {
         item.onclick = function () {

            const img = item.innerHTML;
            banner.innerHTML = img;

            bgSetting.classList.remove("bgSettingOpen");
            feature[1].classList.remove("openFeature");
            pomodoro.classList.remove("pomodoroClose");
         };
      });

      settingBtn.onclick = function () {
         settingBlock.classList.toggle("settingOpen");
         musicBlock.classList.remove("musicOpen")
      };
      applyBtn.onclick = function (e) {
         e.preventDefault();
         _this.setConfig("studyTime", studyTimeInput.value);
         _this.setConfig("breakTime", breakTimeInput.value);
         _this.setConfig("longBreakTime", longBreakTimeInput.value);
         _this.setConfig("autoStartBreak", autoStartBreak.checked);
         _this.setConfig("autoStartStudy", autoStartStudy.checked);
         _this.setConfig("breakInerval", breakInervalInput.value);

         alert("ok");
         settingBlock.classList.remove("settingOpen");
      };
      
   },

   setDefault: function () {
      studyTimeInput.value = this.config.studyTime ?? studyTime;
      breakTimeInput.value = this.config.breakTime ?? breakTime;
      longBreakTimeInput.value = this.config.longBreakTime ?? longBreakTime;
      autoStartBreak.checked = this.config.autoStartBreak?? isAutoBreak;
      autoStartStudy.checked = this.config.autoStartStudy ?? isAutoStudy;
      breakInervalInput.value = this.config.breakInerval ?? breakInerval;
   },

   start: function () {
      this.renderTheme();
      this.renderVideoList();
      this.hanldeEvent();
      this.setDefault();
   },
};
bgConfig.start();
