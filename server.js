// server.js
// where your node app starts
//
// init project
const express = require('express');
const app = express();
const axios = require('axios');
const {
    Client,
    RichEmbed
} = require('discord.js');
var client = new Client();
var token = "NjE3NzgyNTg1NTk0MjE2NDQ4.XWwI9w.RhCEqTD30HpJCmij0P9McxQZq5E"
var scriptID = "AKfycbxQeVF4720epXP3Bc-x0vP1V6MUBKcMj3dy358XTdhewKiluHDY" + "/exec"
async function startApp() {
    client.login(token)
    console.log("Successfully logged Discord bot in");
}
startApp();
client.on("ready", () => {
    console.log("Ready");
})

var prefix = ';';

function isCommand(command, message) {
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
client.on('message', (message) => {
    if (message.author.id != 617782585594216448) { // Dont answer yourself.
        const args = message.content.slice(prefix.length).split(' ');
        if (isCommand("Ban", message)) {
            console.log("Banning player UserId " + args[1]);
            message.channel.send("Banning player UserId " + args[1]);
            axios.post("https://script.google.com/macros/s/" + scriptID + "?sheet=Global&key=" + args[1] + "&value=" + true, {});
          //Unban the user
        } else if (isCommand("Unban", message)) {
            console.log("Unbanning player UserId " + args[1]);
            message.channel.send("Unbanning UserId " + args[1]);
            axios.post("https://script.google.com/macros/s/" + scriptID + "?sheet=Global&key=" + args[1], {});
            
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

// listen for requests :)
const http = require('http');
var listener = app.listen(process.env.PORT, function() {
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
    console.log('Your app is listening on port ' + listener.address().port);
});