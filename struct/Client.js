const {Client, GatewayIntentBits, Collection} = require('discord.js');

module.exports = class extends Client {
    constructor(config) {
        super({
            intents: [
                GatewayIntentBits.Guilds, // Necessary for interaction within guilds
            GatewayIntentBits.GuildMessages, // Access messages in guilds
            GatewayIntentBits.MessageContent, // Necessary to read message content
            GatewayIntentBits.GuildMessageReactions // Access to message reactions in guilds
        ]});

        // project wise variables
        this.activeDice = new Set();
        this.pokedRecently = new Set();
        this.minedRecently = new Set();
        this.chestRecently = new Set();

        this.cooldowns = new Collection();
        this.commands = new Collection();

        // dev mode global flag
        this.devMode = false;

        // bot configs
        this.config = config;
    }
}