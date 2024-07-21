//// IMPORTS ////

// include the Node.js 'path' module at the top of your files
const path = require('node:path')

// import file and yaml for config
const fs = require('fs');
const yaml = require('js-yaml');

//import express
const express = require('express');
const exp = express();
exp.use(express.static(__dirname));
exp.use('favicon.ico', express.static('favicon.ico'));


//import http server
const http = require('http');
const server = http.createServer(exp);
let PORT = 8080;

//import socket io library for communicationadasdaw
const { Server } = require("socket.io");
const io = new Server(server);

// import electron
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// other JS files
const chat = require('./js/chat.js');
const utils = require('./js/utils.js');



// ---- create the electron window ---- //
// const createWindow = () => {
//     const win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             preload: path.join(__dirname, 'preload.js')
//         }
//     }) 

//     win.loadFile('index.html')
// }

// app.whenReady().then(() => {
//     createWindow()

//     app.on('activate', () => {
//         if(BrowserWindow.getAllWindows().length === 0) createWindow()
//     })
// })

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })



// read the config file
var config = yaml.load(fs.readFileSync('config.yaml', 'utf8'));


// pure html server

//connect the app to the html
exp.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});



////     SERVER INTERACTIONS     ////


//start socket connection
io.on('connection', (socket) => {

    // initialize the chat
    try{
        io.emit('init-chat', {users:chat.getChatUsers(config.num_chatters),msgs:chat.getChatMsgs(config.msgFile)});

    }catch(err){
        console.log(err);
    }

    // initialize the avatar (using config data)
    try{
        io.emit('init-avatar', {avatar_img:config.avatarIMG, bg_img:config.avatarBGIMG, bg_color:config.avatarBGColor});
    }catch(err){
        console.log(err);
    }
});


//listen on port 'localhost:8080' for incoming sockets
server.listen(PORT, () => {
	console.log(`listening on localhost: ${PORT} ...`);	
});