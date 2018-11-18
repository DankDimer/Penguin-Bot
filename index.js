// https://trello.com/b/KZ0Dt5ww/penguin-bot
// 0.0.0 (MAJOR RELEASE).(SMALL FEATURES).(BUG FIXES AND SMALLER CHANGES)
//********************************************************************************************************
const Discord = require("discord.js");
const fs = require("fs");
const discord = require("discord.js");
const schedule = require("node-schedule");
//----------------------------------------------------------------------------
// -------------------------------------------
const colors = require("./colors.json")
const botconfig = require("./botconfig.json")
const coins = require("./coins.json")
const xp = require("./xp.json")
// -------------------------------------------
const client = new Discord.Client()
const bot = new Discord.Client()
// -------------------------------------------
bot.commands = new Discord.Collection()
// -------------------------------------------
let cooldown = new Set();
let cdseconds = 1;
//--------------------------------------------
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"))
// -------------------------------------------
//################################
let red = botconfig.red
let orange = botconfig.orange
let yellow = botconfig.yellow
let green = botconfig.green
let blue = botconfig.blue
let indigo = botconfig.indigo
let violet = botconfig.violet
//################################
let black = botconfig.black
let gray = botconfig.gray
let white = botconfig.white
//################################
let pink = botconfig.pink
let brown = botconfig.brown
let maroon = botconfig.maroon
let crimson = botconfig.crimson
let limegreen = botconfig.limegreen
let darkgreen = botconfig.darkgreen
let turquoise = botconfig.turquoise
let aqua = botconfig.aqua
let aquamarine = botconfig.aquamarine
let ltblue = botconfig.ltblue
let navy = botconfig.navy
let purple = botconfig.purple
let magenta = botconfig.magenta
//################################
//***********************************************************************************************************************************************
//END OF CONSTANTS AND VARIABLES
//***********************************************************************************************************************************************
fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    //***********************************************************************************************************************************************
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
});
    
//***********************************************************************************************************************************************
//START OF ACTUAL BOT
//***********************************************************************************************************************************************
bot.on("ready", async () => {

    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
    bot.user.setActivity("Club Penguin", {
        type: "PLAYING"
    });

//***********************************************************************************************************************************************
//DELETE NON-PINNED MSGS IN #SUBMISSIONS AT MIDNIGHT
//***********************************************************************************************************************************************

    //schedule.scheduleJob("0 0 * * *", () => {
        if (bot.guilds.find(x => x.name === "Knoddy Industries")) {
            let guild = bot.guilds.find(x => x.name === "Knoddy Industries");
            
            console.log("dwasdwa");
            if (guild.channels.find(x => x.name === "submissions")) {
                console.log("dwasdwa");
                if (guild.channels.find(x => x.name === "submissions") === "text") {
                    console.log("dwasdwa");
                    function fetchMsgs() {
                        let channel = guild.channels.find(x => x.name === "submissions");

                        channel.fetchMessages( {limit: 100} )
                        .then(function(messages) {
                            console.log("dwasdwa");

                            if (messages.size === 0) {
                                return;
                            }

                            messages.forEach(function(message) {
                                if (message.pinned === true) {
                                    // Don't Delete
                                } else {
                                    message.delete();
                                }
                            });
                        });
                    }

                    fetchMsgs();
                }
            }
        }
    //});
});
//***********************************************************************************************************************************************
bot.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefixes = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        };
    }

    //***********************************************************************************************************************************************
    //Beginning of Pinger System
    //***********************************************************************************************************************************************

    if (message.mentions.members.first()) {
        message.mentions.members.forEach(function(user) {
            let embed = new Discord.RichEmbed()
            embed.color = 16007775
            embed.setAuthor("Pinged Alert!", "https://i.imgur.com/ZrT9MM0.png")
            embed.addField("Type: ", "**USER**", true)
            embed.addField(`User:`, `**${message.author.username}**`, true)
            embed.addBlankField()
            embed.addField("Message", message.content);

            user.user.send(embed);
        });
    }   

    if (message.mentions.roles.first()) {
        message.mentions.roles.forEach(function(role) {
            message.guild.members.forEach(function(member) {
                if (member.roles.find(x => x.name === role.name)) {
                    let embed = new Discord.RichEmbed()
                    embed.color = 16007775
                    embed.setAuthor("Pinged Alert!", "https://i.imgur.com/ZrT9MM0.png")
                    embed.addField("Type: ", "**ROLE**", true)
                    embed.addField(`User:`, `**${message.author.username}**`, true)
                    embed.addBlankField()
                    embed.addField("Message", message.content);

                    member.user.send(embed);
                };
            });
        });
    }

    if (message.mentions.channels.first()) {
        message.mentions.channels.forEach(function(channel) {
            message.guild.members.forEach(function(member) {
                if (message.channel.permissionsFor(member).has("VIEW_CHANNEL")) {
                    let embed = new Discord.RichEmbed()
                    embed.color = 16007775
                    embed.setAuthor("Pinged Alert!", "https://i.imgur.com/ZrT9MM0.png")
                    embed.addField("Type: ", "**CHANNEL**", true)
                    embed.addField(`User:`, `**${message.author.username}**`, true)
                    embed.addBlankField()
                    embed.addField("Message", message.content);

                    member.user.send(embed);
                }
            });
        });
    }
    
    //***********************************************************************************************************************************************
    //Beginning of coin system
    //***********************************************************************************************************************************************
    if (!coins[message.author.id]) {
        coins[message.author.id] = {
            coins: 0
        };
    }

    let coinAmt = Math.floor(Math.random() * 15) + 1;
    let baseAmt = Math.floor(Math.random() * 15) + 1;
    console.log(`${coinAmt} ; ${baseAmt}`);

    if (coinAmt === baseAmt) {
        coins[message.author.id] = {
            coins: coins[message.author.id].coins + coinAmt
        }
        fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
            if (err) console.log(err)
        })
        let coinEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setColor(limegreen)
            .addField("💸", `${coinAmt} coins added!`);

        message.channel.send(coinEmbed).then(msg => {
            msg.delete(2000)
        });
    }
    //***********************************************************************************************************************************************
    //End of coin system
    //===============================================================================================================================================
    //Beginning of XP system
    //***********************************************************************************************************************************************
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    console.log(xpAdd);

    if (!xp[message.author.id]) {
        xp[message.author.id] = {
            xp: 0,
            level: 1
        };
    }


    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 300;
    xp[message.author.id].xp = curxp + xpAdd;
    if (nxtLvl <= xp[message.author.id].xp) {
        xp[message.author.id].level = curlvl + 1;
        let lvlup = new Discord.RichEmbed()
            .setTitle("Level Up!")
            .setColor(aqua)
            .addField("New Level", curlvl + 1);

        message.channel.send(lvlup).then(msg => {
            msg.delete(3000)
        });
    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
        if (err) console.log(err)
    })
    //***********************************************************************************************************************************************
    //End of XP system
    //===============================================================================================================================================
    //Beginning of cooldown system
    //***********************************************************************************************************************************************
    let prefix = prefixes[message.guild.id].prefixes;
    if (!message.content.startsWith(prefix)) return;
    if (cooldown.has(message.author.id)) {
        message.delete();
        return message.reply("You have to wait 5 seconds between commands.")
    }
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        cooldown.add(message.author.id); 
    }
    
    //***********************************************************************************************************************************************
    //End of cooldown system
    //===============================================================================================================================================
    //Beginning of command handler
    //***********************************************************************************************************************************************
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
    
    //***********************************************************************************************************************************************
    //End of command handler
    //===============================================================================================================================================

   setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cdseconds * 1000) 
});
});
//***********************************************************************************************************************************************
//End of command handler
//===============================================================================================================================================
bot.login(process.env.BOT_TOKEN)
//End of index.js
//***********************************************************************************************************************************************
