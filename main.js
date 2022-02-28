let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let prev_btn = document.querySelector(".prev-track");
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");


let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");

let isPlaying = false;
let track_index = 0;
let updateTimer;

//create new audio element
let curr_track = document.createElement('audio');

//make lists of track to play
let track_list = [
    {
      name: "Night Owl",
      artist: "Broke For Free",
      image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
      path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
    },
    {
      name: "Enthusiast",
      artist: "Tours",
      image: "https://images.pexels.com/photos/3100835/pexels-photo-3100835.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
      path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
    },
    {
      name: "Shipping Lanes",
      artist: "Chad Crouch",
      image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
      path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    },
  ];

function loadTrack(track_index) {
    //clear prev track seek timer
    clearInterval(updateTimer);
    resetValues();

    //load a new track
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    //update tracks' details
    now_playing.textContent = "Playing " + (track_index + 1) + " OF " + track_list.length;
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;

    //for upating seek slider
    //set interval of 1000milliseconds
    updateTimer = setInterval(seekUpdate, 1000);
    //move to next track by 'ended' event
    curr_track.addEventListener('ended', nextTrack);
    //appyly random color bg
    random_bg_color();
}
function random_bg_color() {
    //get random number between 64 and 256
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;
    //construct color with random values
    let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";
    //set color 
    document.body.style.background = bgColor;
}
function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
loadTrack(track_index);

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}
function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-4x"></i>';
}
function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-4x"></i>';
}
function prevTrack() {
    //go back the last track if curr track is the first track
    if (track_index > 0) track_index -= 1;
    else track_index = track_list.length - 1;
    //load and play the new track
    loadTrack(track_index);
    playTrack();
}
function nextTrack() {
    //go back the first track if curr track is the last track
    if (track_index < track_list.length - 1) track_index += 1;
    else track_index = 0;
    //load and play the new track
    loadTrack(track_index);
    playTrack();
}
function seekUpdate() {
    //calculate seek position to set seek slider
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        //calculate the time left and total duration
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        //add a 0 to the single digit time values
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }
        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        //display the updatedd duration
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
function seekTo() {
    //percentage of seek slider value to get relative duration of the track
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
//set the volume by volume slider percentage value
function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}