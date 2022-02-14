import { mySongs } from "./data.js";
const $ = document.querySelector.bind(document);

const musicBK = $(".musicBlock");
const player = $(".btn-toggle-play");
const heading = $(".songTitle h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(" .btn-toggle-play");
const progress = $("#progress");
const radomButton = $(".btn-random");
const repeatButton = $(".btn-repeat");
const playList = $(".playlist");
const volumeProgress = $('.volumeProcess')

const PLAYER_STORAGE_KEY = "YUSHAKU_PLAYER";

const musicPlayer = {
   currentIndex: 0,
   isPlaying: false,
   isRandom: false,
   isRepeat: false,
   musicConfig: {},
   songs: mySongs,

   defindProperties: function () {
      Object.defineProperty(this, "currentSong", {
         get: function () {
            return this.songs[this.currentIndex];
         },
      });
   },
   render: function () {
      const html = this.songs.map((song, index) => {
         return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
               <h3 class="title">${song.name}</h3>
               <p class="author">${song.singer}</p>
            </div>
            <div class="option">
               <ion-icon name="ellipsis-vertical"></ion-icon>                  
            </div>
            </div>
            `;
      });
      playList.innerHTML = html.join("");
   },
   handleEvent: function () {
      // =============================cd ==============================================
      const cdWidth = cd.offsetWidth;
      const _this = this;

      musicBK.onscroll = function () {
         const scrollTop = window.scrollY || document.documentElement.scrollTop;
         const newCDwidth = cdWidth - scrollTop;
         cd.style.width = newCDwidth >= 0 ? newCDwidth + "px" : 0;
         cd.style.opacity = newCDwidth / cdWidth;
      };
      //sử lý việc quay cd
      const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
         duration: 10000,
         iterations: Infinity,
      });
      cdThumbAnimate.pause();

      // ======================================play=====================================
      playBtn.onclick = function () {
         _this.isPlaying ? audio.pause() : audio.play();
      };
      audio.onplay = function () {
         _this.isPlaying = true;
         player.classList.add("musicPlaying");
         cdThumbAnimate.play();
      };
      audio.onpause = function () {
         _this.isPlaying = false;
         player.classList.remove("musicPlaying");
         cdThumbAnimate.pause();
      };

      volumeProgress.onclick = function(){
         audio.volume = volumeProgress.value/100
      };

      // ================================================progress===================================
      audio.ontimeupdate = function () {
         if (audio.duration) {
            const currentProcess = Math.floor((audio.currentTime * 100) / audio.duration);
            progress.value = currentProcess;
         }
      };
      //xử lý khi tua bài hát
      progress.onchange = function (e) {
         let seekTime = (audio.duration / 100) * e.target.value;
         audio.currentTime = seekTime;
      };

      //==================================== play next/prev button===================================
      const nextBtn = $(".btn-next");
      const prevBtn = $(".btn-prev");
      nextBtn.onclick = function () {
         _this.playNextSong()
      };
      prevBtn.onclick = function () {
         _this.playPrevSong()
      };
      ///============================= random/repeat button ===========================================
      radomButton.onclick = function () {
         _this.isRandom = !_this.isRandom;
         _this.musicConfig.isRandom = _this.isRandom;
         _this.musicConfig.isRepeat = _this.isRepeat;
         addToLocalStorage(PLAYER_STORAGE_KEY, _this.musicConfig);
         radomButton.classList.toggle("active", _this.isRandom);
      };
      repeatButton.onclick = function () {
         _this.musicConfig.isRandom = _this.isRandom;
         _this.isRepeat = !_this.isRepeat;
         _this.musicConfig.isRepeat = _this.isRepeat;
         addToLocalStorage(PLAYER_STORAGE_KEY, _this.musicConfig);
         repeatButton.classList.toggle("active", _this.isRepeat);
      };

      //================================ when audio ended ======================================
      audio.onended = function () {
         _this.isRepeat ? audio.play() : nextBtn.click();
      };

      // =============================select a song on play list ==============================
      playList.onclick = function (e) {
         const songNode = e.target.closest(".song:not(.active)");
         const songOption = e.target.closest(".option");

         if (songNode || !songOption) {
            // click to song
            if (songNode) {
               _this.currentIndex = Number(songNode.dataset.index);
               _this.loadCurrentSong();
               _this.render();
               audio.play();
            }
         }
      };


      document.addEventListener(
         "keydown",
         (event) => {
            var name = event.code;
            if (name === "Space" && event.shiftKey) {
               _this.isPlaying ? audio.pause() : audio.play();
            } else if (name == "ArrowUp") {
               audio.volume = 1 ? (audio.volume = 1) : (audio.volume += 0.1);
            } else if (name == "ArrowDown") {
               audio.volume = 0 ? (audio.volume = 0) : (audio.volume -= 0.1);
            } else if (name == "ArrowLeft") {
               this.playPrevSong()
            } else if (name == "ArrowRight") {
               this.playNextSong();
            }
         },
         false
      );
   },

   loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
      audio.src = this.currentSong.path;
   },

   loadVolume:function(){
      volumeProgress.value = audio.volume*100
   },

   nextSong: function () {
      this.currentIndex++;
      console.log(this.currentIndex)
      if (this.currentIndex >= this.songs.length) {
         this.currentIndex = 0;
      }
      this.loadCurrentSong();
   },

   playNextSong: function () {
      this.isRandom ? this.playRamdom() : this.nextSong();
      audio.play();
      this.render();
      this.scrollToActiveSong();
   },
   prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
         this.currentIndex = this.songs.length;
      }
      this.loadCurrentSong();
   },
   playPrevSong: function(){
      this.isRandom ? this.playRamdom() : this.prevSong();
      audio.play();
      this.render();
      this.scrollToActiveSong();
   },

   playRamdom: function () {
      let newIndex;
      do {
         newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);

      this.currentIndex = newIndex;
      this.loadCurrentSong();
   },

   loadConfig: function () {
      this.isRandom = getDataFromLocalStorage(PLAYER_STORAGE_KEY).isRandom ?? false;
      this.isRepeat = getDataFromLocalStorage(PLAYER_STORAGE_KEY).isRepeat ?? false;

      repeatButton.classList.toggle("active", this.isRepeat);
      radomButton.classList.toggle("active", this.isRandom);
   },
   scrollToActiveSong: function () {
      setTimeout(() => {
         $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest",
         });
      }, 500);
   },

   start: function () {
      this.loadVolume();
      this.loadConfig();
      // định nghĩa them các property của object
      this.defindProperties();

      // play current song
      this.loadCurrentSong();

      //lắng nghe và sử lý các sự kiên dom events
      this.handleEvent();

      // render ra giao diện
      this.render();
   },
};

musicPlayer.start();
