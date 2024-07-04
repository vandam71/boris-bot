const { Events } = require('discord.js');
const {newUserInteraction} = require('../models/user');

module.exports = {
    name: Events.MessageCreate,
    async execute(interaction, client) {
        if (interaction.author.bot) return;
        
        if (client.devMode && interaction.author.id !== '90535285909118976') return;

        await newUserInteraction(interaction.author);
    }
}