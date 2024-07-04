require('dotenv').config(); //initializes dotenv

const ElBoris = require("./struct/Client");
const client = new ElBoris();

const fs = require('node:fs');
const path = require('node:path');

// Dynamically read the files for functions, events, and commands
const functions = fs.readdirSync(path.join(__dirname, 'functions')).filter(file => file.endsWith('.js'));
const events = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

// Retrieve necessary IDs and token from environment variables
const clientId = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const botToken = process.env.CLIENT_TOKEN;

(async () => {
    //Load and apply all funciton modules to the client
    for (const file of functions) {
        require(path.join(__dirname, `./functions/${file}`))(client);
    }

    //Load and handle events
    client.handleEvents(events, path.join(__dirname, "events"));

    // Load commands
    client.handleCommands(botToken, commandFolders, path.join(__dirname, 'commands'), clientId, guildID);

    client.login(botToken);    

})();