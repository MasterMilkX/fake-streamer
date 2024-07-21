// CLIENT SIDE NODEJS INTERFACE 
// Interacts with the NodeJS server to update the HTML interface for the fake streamer app
// Written by Milk


///////////  GLOBAL VARIABLES and IMPORTS   /////////// 

var socket = io();

// chat
var CHAT_USERS = [];
var MSG_SET = []
var last_msg = "";

// avatar
const EMOTES = ["neutral", "rage", "lets-go", "confusion", "locked-in"]
const EMOTE_WEIGHTS = [0.5, 0.05, 0.15, 0.05, 0.25];
let CUR_EMOTE = "neutral";
let AVATAR_BG_IMG = new Image();
let AVATAR_BG_COLOR = "#000000";
let AVATAR_IMG = new Image();
let et = 0;


// info
let CUR_VIEWER_NUM = 0;
let COMMENT_AUDIO = [];
let last_press = 0;         // last index of the audio played (copy key)

var COMMENT_SET = [];
let CUR_COMMENT = "";
let COMMENT_INDEX = 0;
let ct = 0;                 // comment timeout before disappearing
let tt = 0;                 // typewriter effect timeout


// video
let VIDEO_FRAME = document.getElementById("video-player");
let VIDEO_SET = [];         // set of video links and their timeouts
let VIDEO_INDEX = 0;        // current video index
let vt = 0;                 // video timeout    (for changing videos)


///////////        HTML ELEMENTS        ///////////// 

// chat
var CHAT_BOX = document.getElementById("chat-box");

// avatar
let AVATAR_CANVAS = document.getElementById("avatar-canvas");
let AVATAR_CTX = AVATAR_CANVAS.getContext("2d");


/////////    APP MODIFICATION FUNCTIONS    //////////


// --- CHAT BOX --- //

// initialize the chat box with a set of users and messages
function initChat(users,msg_set){
    CHAT_USERS = users;
    MSG_SET = msg_set;
    CHAT_BOX.innerHTML = "";
    runChat();
}

// continously post messages from random users
function runChat(delay=1000){
    let user = randArr(CHAT_USERS);
    let message = (Math.random() > 0.3 ? randArr(MSG_SET) : last_msg);
    // console.log(user.name + ": " + message);
    newMsg(user, message);
    setTimeout(function(){runChat(delay);}, randInt(200, 1000));
}

// adds a new message to the chat box
function newMsg(user, message){
    let msg = document.createElement("div");
    msg.classList.add("chat-msg");
    let rank = document.createElement("span");
    rank.classList.add(user.rank);
    rank.innerHTML = user.name;
    msg.appendChild(rank);
    msg.innerHTML += ": " + message;
    last_msg = message;
    CHAT_BOX.appendChild(msg);
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;       // scroll to bottom
    
    // remove old messages
    if(CHAT_BOX.children.length > 50){
        CHAT_BOX.removeChild(CHAT_BOX.children[0]);
    }
}




// --- AVATAR --- //

// set the current avatar
function setAvatarIMG(img_path,bg_color="#000000",bg_img=null){
    AVATAR_IMG.src = img_path;
    
    console.log("> Loading avatar image...");
    AVATAR_IMG.onload = function(){
        console.log("> Avatar image loaded successfully.");
        drawAvatar();
    }

    AVATAR_BG_COLOR = bg_color;
    document.getElementById("avatar").style.backgroundColor = bg_color;


    if(bg_img != null){
        console.log("> Loading avatar background image...");
        AVATAR_BG_IMG.src = bg_img;
        AVATAR_BG_IMG.onload = function(){
            console.log("> Avatar background image loaded successfully.");
            drawAvatar();
        }
    }

}

// draw the avatar on the canvas
function drawAvatar(){
    // clear canvas
    AVATAR_CTX.clearRect(0, 0, AVATAR_CANVAS.width, AVATAR_CANVAS.height);

    // draw background
    AVATAR_CTX.fillStyle = AVATAR_BG_COLOR;
    AVATAR_CTX.fillRect(0, 0, AVATAR_CANVAS.width, AVATAR_CANVAS.height);
    if(AVATAR_BG_IMG.width != 0){
        AVATAR_CTX.drawImage(AVATAR_BG_IMG, 0, 0, AVATAR_CANVAS.width, AVATAR_CANVAS.height);
    }

    // draw emote
    if(AVATAR_IMG.width == 0){
        console.log("> ERROR: Avatar image not loaded!");
        return;
    }
    AVATAR_CTX.drawImage(AVATAR_IMG, EMOTES.indexOf(CUR_EMOTE)*64, 0, 64, 64, 0, 0, 64, 64);
}

// change the current emote
function changeEmote(){
    CUR_EMOTE = weightRandArr(EMOTES, EMOTE_WEIGHTS);
    drawAvatar();

    clearTimeout(et);
    et = setTimeout(function(){changeEmote()}, randInt(3000, 10000));       // change expression every 1-5 seconds

    // make commentary if not already
    if(CUR_COMMENT == ""){
        newComment();
    }
}





// --- INFO AND COMMENTARY --- //

// viewers
function setViewers(start_num){
    document.getElementById("stream-viewers").innerHTML = "🤖: " + start_num;
    CUR_VIEWER_NUM = start_num;
}

function flucViewers(){
    let new_num = CUR_VIEWER_NUM + randInt(-5, 5);
    new_num = Math.max(0, new_num);
    document.getElementById("stream-viewers").innerHTML = "🤖: " + new_num;
    CUR_VIEWER_NUM = new_num;
    setTimeout(function(){flucViewers();}, randInt(2000, 5000));
}


// streamer commentary

// set the audio clips for the commentary character bits
function setCommentaryAudio(audio_set, volume=0.3){
    for(let i=0;i<audio_set.length;i++){
        let audio = new Audio(audio_set[i]);
        audio.volume = volume;
        COMMENT_AUDIO.push(audio);
    }
}

// typewriter effect for the commentary
function typeComment(cmt){
    CUR_COMMENT = cmt;
    COMMENT_INDEX = 0;
    document.getElementById("commentary").innerHTML = "";
    clearTimeout(tt);

    // start typing
    tt = setInterval(function(){
        document.getElementById("commentary").innerHTML += CUR_COMMENT.charAt(COMMENT_INDEX);
        COMMENT_INDEX++;

        // play random audio clip
        let audio_index = CUR_COMMENT[COMMENT_INDEX] == CUR_COMMENT[COMMENT_INDEX-1] ? last_press : randInt(0, COMMENT_AUDIO.length-1);
        last_press = audio_index;
        COMMENT_AUDIO[audio_index].play();

        // reached the end of the comment, so reset after a delay
        if(COMMENT_INDEX >= CUR_COMMENT.length){
            clearInterval(tt);
            ct = setTimeout(function(){clearComment();}, 5000);
        }
    }, 100);
}

// clear the commentary
function clearComment(){
    document.getElementById("commentary").innerHTML = "";
    CUR_COMMENT = "";
    clearTimeout(ct);
    clearTimeout(tt);
}

// new commentary
function newComment(){
    let cmt = randArr(COMMENT_SET);
    typeComment(cmt);
}


/////////    VIDEO    //////////

function setVideoVolume(volume){
    VIDEO_FRAME.volume = volume;
}

// play the video and set the timeout for the next video
function setVideo(vid_dat){
    VIDEO_FRAME.src = vid_dat.video_link;

    // set the timeout for the video
    clearTimeout(vt);
    vt = setTimeout(function(){
        VIDEO_INDEX++;
        // loop back to the beginning
        if(VIDEO_INDEX >= VIDEO_SET.length){
            VIDEO_INDEX = 0;
        }
        setVideo(VIDEO_SET[VIDEO_INDEX]);
    }, vid_dat.video_timeout*1000);
}


/////////    SERVER RECEPTION FUNCTIONS    //////////

socket.on('init-chat', function(data) {
    initChat(data.users, data.msgs);
    console.log("> Chat running...");
});

socket.on('init-avatar', function(data) {
    console.log("> Avatar received: " + data.avatar_img);
    setAvatarIMG(data.avatar_img, data.bg_color, data.bg_img);

    changeEmote();
    console.log("> Avatar running...");
});

socket.on('init-info', function(data) {

    console.log("> Info received: " + data.num_viewers);

    // fluctuating viewers
    setViewers(data.num_viewers);
    flucViewers();

    // commentary audio
    setCommentaryAudio(data.audio, data.volume);

    // commentary phrases
    COMMENT_SET = data.comments;
    newComment();

    // set title
    document.getElementById("stream-title").innerHTML = data.title;

    console.log("> Info running...");
});

socket.on('init-video', function(data) {

    // set volume
    setVideoVolume(data.volume);

    // set video set
    VIDEO_SET = data.video_set;
    console.log("> Video set retrieved");

    // start the video
    setVideo(VIDEO_SET[0]);
    console.log("> Video running...");
});


/////////    CLIENT BROADCAST FUNCTIONS    //////////
