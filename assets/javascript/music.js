const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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


const PLAYER_STORAGE_KEY = "YUSHAKU_PLAYER";

const app = {
   currentIndex: 0,
   isPlaying: false,
   isRandom: false,
   isRepeat: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
   setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
   },
   songs: [
      {
         singer: "Shane Ivers",
         name: "Precious Memories ",
         path: "https://www.chosic.com/wp-content/uploads/2021/02/precious-memories.mp3",
         img: "https://images.pexels.com/photos/3521937/pexels-photo-3521937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
         singer: "Pháo, Mouse T, Wack",
         name: "Warm Memories – Emotional Inspiring Piano",
         path: "https://www.chosic.com/wp-content/uploads/2021/02/Warm-Memories-Emotional-Inspiring-Piano.mp3",
         img: "https://images.pexels.com/photos/4665064/pexels-photo-4665064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
         singer: "DH, GDucky, Minh",
         name: "Adventure",
         path: "https://www.chosic.com/wp-content/uploads/2021/05/Adventure-320bit.mp3",
         img: "https://images.pexels.com/photos/3345882/pexels-photo-3345882.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
      },
      {
         singer: "Tage",
         name: "Art Of Silence",
         path: "https://www.chosic.com/wp-content/uploads/2020/07/Art-Of-Silence_V2.mp3",
         img: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      },
      {
         singer: "MCK, Tlinh",
         name: "Morning Routine",
         path: "https://www.chosic.com/wp-content/uploads/2021/09/Morning-Routine-Lofi-Study-Music.mp3",
         img: "https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      },
      {
         singer: "MCK, Tlinh",
         name: "Still Awake",
         path: "https://www.chosic.com/wp-content/uploads/2021/09/Still-Awake-Lofi-Study-Music.mp3",
         img: "https://images.pexels.com/photos/3082341/pexels-photo-3082341.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
         singer: "MCK, Tlinh",
         name: "Stardust",
         path: "https://www.chosic.com/wp-content/uploads/2021/12/alex-productions-calm-and-sleeping-lo-fi-hip-hop.mp3",
         img: "https://images.pexels.com/photos/265129/pexels-photo-265129.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
      {
         singer: "MCK, Tlinh",
         name: "Stardust",
         path: "https://www.chosic.com/wp-content/uploads/2021/12/alex-productions-calm-and-sleeping-lo-fi-hip-hop.mp3",
         img: "https://images.pexels.com/photos/374897/pexels-photo-374897.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      },
   ],
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
         _this.isRandom ? _this.playRamdom() : _this.nextSong();
         audio.play();
         _this.render();
         _this.scrollToActiveSong();
      };
      prevBtn.onclick = function () {
         _this.isRandom ? _this.playRamdom() : _this.prevSong();
         audio.play();
         _this.render();
         _this.scrollToActiveSong();
      };
      ///============================= random/repeat button ===========================================
      radomButton.onclick = function () {
         _this.isRandom = !_this.isRandom;
         _this.setConfig("isRamdom", _this.isRandom);
         radomButton.classList.toggle("active", _this.isRandom);
      };
      repeatButton.onclick = function () {
         _this.isRepeat = !_this.isRepeat;
         _this.setConfig("isRepeat", _this.isRepeat);
         repeatButton.classList.toggle("active", _this.isRepeat);
      };

      //================================ when audio ended ======================================
      audio.onended = function () {
         _this.isRepeat ? audio.play() : nextBtn.click();
      };

      // ====================================select a song on play list ==============================
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
            //click to option button
            if (songOption) {
            }
         }
      };
   },
   loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
      audio.src = this.currentSong.path;
   },
   nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
         this.currentIndex = 0;
      }
      this.loadCurrentSong();
   },
   prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
         this.currentIndex = this.songs.length;
      }
      this.loadCurrentSong();
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
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;

      //second method
      //Object.assign(this, this.config)
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
      this.loadConfig();
      // định nghĩa them các property của object
      this.defindProperties();

      // play current song
      this.loadCurrentSong();

      //lắng nghe và sử lý các sự kiên dom events
      this.handleEvent();

      // render ra giao diện
      this.render();

      radomButton.classList.toggle("active", this.isRepeat);
      radomButton.classList.toggle("active", this.isRandom);
   },
};

app.start();
