// Stratiz X Kensizo v2

// init project
const express = require('express');
var bodyParser = require('body-parser');
const https = require('https');
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
    var promise = client.login(token)
    promise.catch(function(error) {
      console.error("Discord bot login | " + error);
    });
}
startApp();
client.on("ready", () => {
  console.log("Successfully logged Discord bot in");
})


function byUID(method,args,message) {
  https.get("https://api.roblox.com/users/" + args[2], (res) => {
     console.log(`statusCode: ${res.statusCode}`)
      if (res.statusCode == 200) {
        toBan.push({method: method,type: "uid",value: args[2],cid: message.channel.id});
      } else {
        message.channel.send(method + " failed: Invalid userId " + args[2]);
      }
      res.on('data', d => {
        //process.stdout.write(d)
      })
  }).on('error', error => {
    console.error("RBLX API (UID) | " + error);
  });
}

function byUser(method,args,message) {
  const options = {
    hostname: 'api.roblox.com',
    port: 443,
    path: '/users/get-by-username?username=' + args[2],
    method: 'GET'
  }
  https.get("https://api.roblox.com/users/get-by-username?username=" + args[2], (res) => {
      console.log(`statusCode: ${res.statusCode}`)
      let data = '';
      res.on('data', d => {
        data += d
      })
      res.on('end', () => {
        console.log(data);
        if (JSON.parse(data).Id != undefined) {
          toBan.push({method: method,type: "username",value: args[2],cid: message.channel.id});
        } else {
          message.channel.send(method + " failed: Invalid username " + args[2]);
        }
      });
  }).on('error', error => {
    console.error("RBLX API (Username) | " + error);
  });
}

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
        if (args[1] == "id") {
          message.channel.send("Attempting to ban player with UserId " + args[2]);
          byUID("Ban",args,message);
          
        } else if (args[1] == "user") {
          message.channel.send("Attempting to ban player with username " + args[2]);
          byUser("Ban",args,message);
        } else {
          message.channel.send("Invalid command: Syntax is `ban user Player12` or `ban id 12342312`");
        }
      } else if (isCommand("Unban", message)) {
        if (args[1] == "id") {
          message.channel.send("Attempting to unban player with UserId " + args[2]);
          byUID("Unban",args,message);
          
        } else if (args[1] == "user") {
          message.channel.send("Attempting to unban player with username " + args[2]);
          byUser("Unban",args,message);
        } else {
          message.channel.send("Invalid command: Syntax is `unban user Player12` or `unban id 12342312`");
        }
      }
    }
});
//
app.use(express.static('public'));

app.get('/', function(request, response) {
    const channel = client.channels.cache.get('<id>');
    channel.send('<content>');
    response.sendFile(__dirname + '/views/index.html');
});

// listen for requests & Keep bot alive

let listener = app.listen(process.env.PORT, function() {
    //setInterval(() => { // Used to work sometime ago
    //    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    //}, 280000);
    console.log('Not that it matters but your app is listening on port ' + listener.address().port);
});

client.on('error', console.error)