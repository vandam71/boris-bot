const Item = require('../../models/item');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "dev",
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Dev command')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Dev type')
            .setRequired(false)),
    async execute(interaction, client) {
        if (interaction.user.id !== '90535285909118976') return interaction.reply('you are not a developer');
        
        const value = interaction.options.getString('type');

        if(!value) return interaction.reply('working as intended');

        switch (value){
            case 'emojis':
                let emojis = {};
                const emojiList = client.guilds.cache.get('773626087934001192').emojis.cache.map(e => e.toString());
                for (let i = 0; i < emojiList.length; i++) {
                    let emoji = emojiList[i].substring(2).slice(0, -1).split(':')
                    emojis[emoji[0]] = emoji[1];
                }
                await interaction.reply(JSON.stringify(emojis));
                break;

            case 'add_item':
                await Item.create({name: "Speed Perk", description: "Accelerates the mining process", id: 1, price: 100, emote: ':perk_speed:842116583676444672', category: "perk"});
                await Item.create({name: "Luck Perk", description: "Increased the chance of more coins from mining", id: 2, price: 100, emote: ':perk_luck:842141817990152212', category: "perk"});
        }
    }
}