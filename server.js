// server.js
// where your node app starts
//
// init project
const express = require('express');
const app = express();

const { Client, RichEmbed } = require('discord.js');
var client = new Client();
var token = "NjE3NzgyNTg1NTk0MjE2NDQ4.XWwI9w.RhCEqTD30HpJCmij0P9McxQZq5E"
async function startApp () {
    client.login(token)
    console.log("Successfully logged Discord bot in");
}

client.on("ready", () => {
  
}
          

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