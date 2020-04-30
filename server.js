// Stratiz X Kensizo v2

// init project
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const {
    Client,
    RichEmbed
} = require('discord.js');
let client = new Client();

//// IMPORTANT VVV
let token = process.env.SECRET //Your token goes in key.env (Discord bot)
let prefix = ';'; // Discord bot prefix
/// IMPORTANT ^^^

async function startApp() {
    client.login(token)
}
startApp();
client.on("ready", () => {
    console.log("Successfully logged Discord bot in");
})

function isCommand(command, message) {
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
var toBan = [];
client.on('message', (message) => {
  if(message.author.bot) return;
   if (message.member.roles.some(role => role.name === 'ROLENAME')) {
      const args = message.content.slice(prefix.length).split(' ');
      if (isCommand("Ban", message)) {
        if (args[1] == "uid") {
          
        } else if (args[1] == "username") {
          
        } else {
          
        }
          console.log("Banning player UserId " + args[1]);
          message.channel.send("Attempting to ban player UserId " + args[1]);
        //Unban the user
      } else if (isCommand("Unban", message)) {
          console.log("Unbanning player UserId " + args[1]);
          message.channel.send("Unbanning UserId " + args[1]);
      }
    }
});

app.use(express.static('public'));

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// listen for requests & Keep bot alive
const http = require('http');
let listener = app.listen(process.env.PORT, function() {
    //setInterval(() => { // Used to work sometime ago
    //    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    //}, 280000);
    console.log('Not that it matters but your app is listening on port ' + listener.address().port);
});

client.on('error', console.error)