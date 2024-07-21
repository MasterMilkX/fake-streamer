# fake-streamer
A web app the simulates a Twitch stream. Includes a fake ongoing chat, a user avatar (streamer), video stream, and avatar sound effects to simulate talking

Written by Milk

---

### Requirements
* NodeJS
* Web-browser (preferably Google Chrome)

### Installation
1. Clone this repository to your local machine
2. Download and install the package manager [NodeJS](https://nodejs.org/en/download/)
3. Open a terminal and navigate to the [KekeJS](.) folder
4. Run the command `npm install` to install the necessary packages found in the [package-lock.json](package-lock.json) file

### Usage
#### Start the server: 
1. Run the command `npm start`. 
2. In a browser, go to the URL `localhost:8080` 
    *Note*: this port number can be changed on _line 20_ in the [index-server.js](index-server.js) file. 
    There will be an error with NodeJS if the port is already in use.

#### Config
Most information and editable items are found in the [config](config.yaml) file. You can set the avatar, phrases list, loaded video file and more.

#### Make a new video list
1. Find a link (Youtube videos work best)
2. Add a `~~~` after the link
3. Put the timeout before changing to the next video in seconds. You can make it the length of the video or something else.
4. Change the `video_set_list` property in the config file to the location of your new video list file
NOTE: It's best to place it in the `data/video_list` folder


--- 
More hints coming soon