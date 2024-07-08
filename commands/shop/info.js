const Item = require('../../models/item');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "shop",
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription("Get information about an item")
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The name of the item you want to inspect')
                .setRequired(true)),
    details: {
        description: "Get information about a specific item.",
        usage: "/info item:<item_name>",
        examples: [
            "/info item:Sapphire - Provides information about the Sapphire.",
        ]
    },
    async execute(interaction, client) {
        await interaction.deferReply()
        const itemString = interaction.options.getString('item');

        let item = await Item.findOne({name: itemString});
        if (!item) return interaction.editReply({embeds: [new EmbedBuilder().setTitle('Item info').setDescription('Not a valid item name.')]});

        return interaction.editReply({embeds: [new EmbedBuilder().setTitle(`Item info: ${item.name} <${item.emote}>`).setDescription(`**Description**: ${item.description}\n **Price**: ${item.price}\n **Category**: ${item.category}`)]})
    }
}