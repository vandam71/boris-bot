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
                // await Item.create({name: "Speed Perk", description: "Accelerates the mining process", id: 1, price: 100, emote: ':perk_speed:842116583676444672', category: "perk"});
                // await Item.create({name: "Luck Perk", description: "Increased the chance of more coins from mining", id: 2, price: 100, emote: ':perk_luck:842141817990152212', category: "perk"});
                // await Item.create({name: "Sapphire", description: "Tier 1 Gem", id: 201, price: 100, emote: ':gem_1:926220295210164245', category: "crafting"});
                // await Item.create({name: "Aquamarine", description: "Tier 2 Gem", id: 202, price: 200, emote: ':gem_2:926220295516352512', category: "crafting"});
                // await Item.create({name: "Ruby", description: "Tier 3 Gem", id: 203, price: 400, emote: ':gem_3:926220295164014623', category: "crafting"});
                // await Item.create({name: "Emerald", description: "Tier 4 Gem", id: 204, price: 800, emote: ':gem_4:926220295440838756', category: "crafting"});
                // await Item.create({name: "Amethyst", description: "Tier 5 Gem", id: 205, price: 1600, emote: ':gem_5:926220295893835786', category: "crafting"});
                // await Item.create({name: "Bronze Key", description: "Opens a Bronze chest", id: 801, price: 0, emote: ':bronze_key:842116583471710288', category: "untradeable"});
                // await Item.create({name: "Gold Key", description: "Opens the Gold Chest", id: 802, price: 0, emote: ':gold_key:842116583471841280', category: "untradeable"});
                
        }
    }
}