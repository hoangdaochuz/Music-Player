// Render playlist vao --> ok
// Thu nho CD khi scroll --------------------------------> ok
//  Bo bai hat vao va phat no ------------> ok
// play/pause/seek -------------------------------------------------------->ok
// CD rotate ----------------ok
// next/prev --------------------------------> ok
// Random--------------> ok
// Next/repeat when ended-------------> ok
// Active bai hat dang phat --------------------------------> ok
//Click vao bai hat muon phat thi no se phat------------>ok

const playlist = document.querySelector('.playlist')
const cd = document.querySelector('.cd');
const cdThumn = document.querySelector('.cd-thumb')
const headingName = document.querySelector('header h2')
const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.btn-toggle-play')
const player = document.querySelector('.player')
const progress = document.querySelector('#progress')
const nextBtn = document.querySelector('.btn-next')
const prevBtn = document.querySelector('.btn-prev')
const randomBtn = document.querySelector('.btn-random')
const repeatBtn = document.querySelector('.btn-repeat')
const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
          name: "Mây lang thang",
          singer: "Tùng Tea x PC",
          path: "./asset/music/song1.mp3",
          image: "./asset/img/hinh1.jpg"
        },
        {
            name: "Hươnng rừng",
            singer: "Tùng Tea X Mr Shyn",
            path: "./asset/music/song2.mp3",
            image: "./asset/img/hinh2.jpg"
        },
        {
            name: "Hương trấu",
            singer: "Tofu(TNS)",
            path: "./asset/music/song3.mp3",
            image: "./asset/img/hinh3.jpg"
        },
        {
            name: "Một thuở thanh bình",
            singer: "TNS",
            path: "./asset/music/song4.mp3",
            image: "./asset/img/hinh4.jpg"
        },
        {
            name: "Beat1",
            singer: "Ng.Khai",
            path: "./asset/music/song5.mp3",
            image: "./asset/img/hinh5.jpg"
        },
        {
            name: "Beat2",
            singer: "Ng.Khai",
            path: "./asset/music/song6.mp3",
            image: "./asset/img/hinh6.jpg"
        },
        {
            name: "Beat3",
            singer: "Ng.Khai",
            path: "./asset/music/song7.mp3",
            image: "./asset/img/hinh7.jpg"
        },
        
       
    ],

    definedProperty: function(){
        Object.defineProperty(this, "currentSong", {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function(){
        const html = this.songs.map((song,index)=>{
            return `
            <div class="song ${index === this.currentIndex ? "active":""}" data-index = "${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
            `
        })

        playlist.innerHTML = html.join('')

    },
    handleEvent: function(){
        _this = this
        const cdWidth = cd.offsetWidth;

        // handle cd thumb rotating
        const cdRotating  = cdThumn.animate([{transform: "rotate(360deg)"}],{
            duration: 10000,
            iterations: Infinity,
        })
        cdRotating.pause()


        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{

                audio.play()
            }
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add("playing");
            cdRotating.play();
        }
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdRotating.pause();
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime / audio.duration)*100)
                progress.value = progressPercent;
            }
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        progress.onchange = function(e){
            const seekTime = e.target.value*audio.duration/100;
            audio.currentTime = seekTime;
        }
        
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{

                _this.nextSong()
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{

                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        } 

        randomBtn.onclick = function(){
            _this.isRandom= !_this.isRandom;
            randomBtn.classList.toggle("active",_this.isRandom);
        }

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active",_this.isRepeat)
        }

        playlist.onclick = function(e){
            const sonNode = e.target.closest('.song:not(.active)');
            if(sonNode|| e.target.closest('.option')){
                if(sonNode){
                    _this.currentIndex = Number(sonNode.getAttribute('data-index'))
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }   
                if(e.target.closest('.option')){

                }
            }
        }
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
    },
    loadCurrentSong: function(){
        cdThumn.style.backgroundImage = `url(${this.currentSong.image})`
        headingName.textContent = this.currentSong.name
        audio.src = this.currentSong.path
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <= 0){
            this.currentIndex =this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex===this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        

    },
    
    scrollToActiveSong: function(){
        setTimeout(function(){
            document.querySelector('.song.active').scrollIntoView({
                behavior:"smooth",
                block:"nearest"

            })
        },300)
    },
    start: function(){

        this.definedProperty()
        this.handleEvent()
        this.loadCurrentSong();  
        this.render();
    }
}

app.start();