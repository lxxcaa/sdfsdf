// Stratiz X Kensizo v2

// init project
const express = require('express');
var bodyParser = require('body-parser');
const https = require('https');
const app = express();
const {
    Client,
    MessageEmbed
} = require('discord.js');
let client = new Client();



//// IMPORTANT VVV
let token = process.env.SECRET //Your token goes in key.env (Discord bot)
let prefix = ';'; // Discord bot prefix
let rolename = "rolenamehere"
/// IMPORTANT ^^^

let numbers = [
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣"
]

async function startApp() {
    var promise = client.login(token)
    console.log("Starting...");
    promise.catch(function(error) {
      console.error("Discord bot login | " + error);
      process.exit(1);
    });
}
startApp();
client.on("ready", () => {
  console.log("Successfully logged in Discord bot.");
})

var toBan = [];
function byUID(method,args,message) {
  const Emb = new MessageEmbed()
      .setColor('#fff200')
      //.setTitle(request.headers.username + "'s Data")
     // .setTitle("Attempt")
      //.setAuthor('Roblox Error','')
      .setDescription("Attempting to get data for UserID "+ args[2] +"...")
      .setTimestamp()
      .setFooter('Developed by Stratiz');
    message.edit(Emb);
  https.get("https://api.roblox.com/users/" + args[2], (res) => {
      
      let data = '';
      res.on('data', d => {
        data += d
      })
      res.on('end', () => {
        if (res.statusCode == 200) {
          toBan.push({method: method,username: JSON.parse(data).Username,value: args[2],cid: message.channel.id});
        } else {
          message.channel.send(method + " failed: Invalid userId " + args[2]);
        }
      });
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
      let data = '';
      res.on('data', d => {
        data += d
      })
      res.on('end', () => {
        if (JSON.parse(data).Id != undefined) {
          toBan.push({method: method,value: JSON.parse(data).Id,username: JSON.parse(data).Username,cid: message.channel.id});
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

const TookTooLong = new MessageEmbed()
  .setColor('#eb4034')
  .setDescription("You took too long to respond!")


async function determineType(message,BotMsg,args) {
  if (isNaN(Number(args[1]))) {
    byUser("GetData",args[1],BotMsg);
  } else {
    const Emb = new MessageEmbed()
      .setColor('#ea00ff')
      //.setTitle(request.headers.username + "'s Data")
      .setTitle("Is this a UserID or a Username?")
      //.setAuthor('Roblox Error','')
      .setDescription("Please react with the number that matches the answer.")
      .addField(numbers[0] + ": Username","This is a players username in game.")
      .addField(numbers[1] + ": UserID","This is the players UserId connect with the account.")
      .setTimestamp()
      .setFooter('Developed by Stratiz');
    BotMsg.edit(Emb);
    try {
      await BotMsg.react(numbers[0]);
      await BotMsg.react(numbers[1]);
    } catch (error) {
      console.error('One of the emojis failed to react.');
    }
    const filter = (reaction, user) => {
      return numbers.includes(reaction.emoji.name) && user.id === message.author.id;
    };
    BotMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        const ind = numbers.findIndex(function(n){
           return n == reaction.emoji.name;
        })
        BotMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
        if (ind == 0) {
          byUser("GetData",args[1],BotMsg);
        } else if (ind == 1) {
          byUID("GetData",args[1],BotMsg);
        } else {
          BotMsg.edit('Something went wrong');
        }//
      })
      .catch(collected => {
        BotMsg.edit(TookTooLong);
        BotMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
      });
  }
}

client.on('message', async (message) => {
  if(message.author.bot) return;
   if (message.member.roles.cache.some(role => role.name === rolename)) {
      const args = message.content.slice(prefix.length).split(' ');
       var Emb = new MessageEmbed()
          .setColor('#eb4034')
          .setDescription("Working...")

      if (isCommand("Ban", message)) {
        var BotMsg = await message.channel.send("<@" + message.author.id + ">",Emb);
        determineType(message);
        if (args[1] == "id") {
          message.channel.send("Attempting to ban player with UserId " + args[2] + "...");
          byUID("Ban",args,message);
        } else if (args[1] == "user") {
          message.channel.send("Attempting to ban player with username " + args[2] + "...");
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
  if (request.headers.username != undefined) { 
    const channel = client.channels.cache.get(request.headers.cid);
    if (request.headers.rblxerror == undefined) {
      channel.send('Successfully ' + request.headers.method + 'ned user ' + request.headers.username + " | ID: " + request.headers.value);
    } else {
      channel.send("Failed to " + request.headers.method + " user: " + request.headers.username + " | ID: " + request.headers.value + " | `Rblx-Error:  " + request.headers.rblxerror + "`"); 
    }
  }
  response.send(toBan[0]);
  toBan.shift();
});

// listen for requests & Keep bot alive

let listener = app.listen(process.env.PORT, function() {
    //setInterval(() => { // Used to work sometime ago
    //    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    //}, 280000);
    console.log('Not that it matters but your app is listening on port ' + listener.address().port);
});

client.on('error', console.error)