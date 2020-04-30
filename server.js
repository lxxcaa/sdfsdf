// server.js
// where your node app starts
// Stratiz X Kensizo v2
// init project

// This project has some default code that glitch likes to throw in.
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const {
    Client,
    RichEmbed
} = require('discord.js');
let client = new Client();
let token = "YOUR_DISCORD_BOT_TOKEN_HERE " //Your token here (Discord bot)
let scriptID = "SCRIPT_ID_HERE" + "/exec" //Your scriptID for your google sheets
let BOTID = 1 // Prevents bot from talking to itself, make sure to put your bots ID there.
async function startApp() {
    client.login(token)
    console.log("Successfully logged Discord bot in");
}
startApp();
client.on("ready", () => {
    console.log("Ready");
})

let prefix = ';';

function isCommand(command, message) {
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
client.on('message', (message) => {
  if(message.author.bot) return;
   if (message.member.roles.some(role => role.name === 'ROLENAME')) {
      const args = message.content.slice(prefix.length).split(' ');
      if (isCommand("Ban", message)) {
          console.log("Banning player UserId " + args[1]);
          message.channel.send("Banning player UserId " + args[1]);
        //Unban the user
      } else if (isCommand("Unban", message)) {
          console.log("Unbanning player UserId " + args[1]);
          message.channel.send("Unbanning UserId " + args[1]);
      }
    }
});

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
//
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// listen for requests & Keep bot alive
const http = require('http');
let listener = app.listen(process.env.PORT, function() {
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
    console.log('Your app is listening on port ' + listener.address().port);
});

client.on('error', console.error)