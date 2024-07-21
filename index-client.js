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


/////////    CLIENT BROADCAST FUNCTIONS    //////////
