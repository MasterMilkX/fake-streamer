//-- imports
const fs = require('fs');
const utils = require('./utils.js');

//-- data structures

// chat users
class ChatUser {
    constructor(name, rank) {
        this.name = name;
        this.rank = rank;
    }
}


// video data
class VideoData {
    constructor(video_link, video_timeout) {
        this.video_link = video_link;
        this.video_timeout = video_timeout;     // 10 seconds
    }
}





// make fake users to interact
function getChatUsers(num_chatters){
    // import the noun and adjective text files
    var nouns = fs.readFileSync('./data/txt/english-nouns.txt').toString().split("\n");
    var adjectives = fs.readFileSync('./data/txt/english-adjectives.txt').toString().split("\n");

    // create new users
    let USERS = [];
    for(let i=0;i<num_chatters;i++){
        let name = (Math.random() > 0.5 ? utils.randArr(adjectives): "") + utils.randArr(nouns) + utils.randInt(0,1000);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let user = new ChatUser(name, utils.weightRandArr(["guest","tier-1", "tier-2", "tier-3"],[0.6,0.2,0.15,0.05]));
        USERS.push(user);
    }

    console.log("> Chat initialized with " + num_chatters + " chatters.");

    return USERS;
}

// get fake chat phrases
function getChatMsgs(msgFile){
    return fs.readFileSync(msgFile).toString().split("\n");
}

// get streamer commentary phrases
function getCommentary(cmtFile){
    return fs.readFileSync(cmtFile).toString().split("\n");
}


// get the video links and their timestamps (split by ~~~ and in seconds)
function getVideoSet(videoFile,shuffle=false){
    let video_set = fs.readFileSync(videoFile).toString().split("\n");
    let VIDEO_SET = [];
    for(let i=0;i<video_set.length;i++){
        let video = video_set[i].split("~~~");
        VIDEO_SET.push(new VideoData(video[0], parseInt(video[1])));
    }
    if(shuffle){
        return utils.shuffle(VIDEO_SET);
    }

    return VIDEO_SET;
}



module.exports = {getChatUsers,getChatMsgs, getCommentary, getVideoSet};