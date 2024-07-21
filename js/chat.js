// imports

const fs = require('fs');

const utils = require('./utils.js');



// chat users
class ChatUser {
    constructor(name, rank) {
        this.name = name;
        this.rank = rank;
    }
}

// make fake users to interact
function getChatUsers(num_viewers){
    // import the noun and adjective text files
    var nouns = fs.readFileSync('./data/english-nouns.txt').toString().split("\n");
    var adjectives = fs.readFileSync('./data/english-adjectives.txt').toString().split("\n");

    // create new users
    let USERS = [];
    for(let i=0;i<num_viewers;i++){
        let name = (Math.random() > 0.5 ? utils.randArr(adjectives): "") + utils.randArr(nouns) + utils.randInt(0,100);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let user = new ChatUser(name, utils.weightRandArr(["guest","tier-1", "tier-2", "tier-3"],[0.6,0.2,0.15,0.05]));
        USERS.push(user);
    }

    console.log("> Chat initialized with " + num_viewers + " chatters.");

    return USERS;
}

function getChatMsgs(msgFile){
    return fs.readFileSync(msgFile).toString().split("\n");
}




module.exports = {getChatUsers,getChatMsgs};