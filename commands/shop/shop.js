const Item = require('../../models/item');
const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    category: "shop",
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Displays the full or specific shops (with argument displays the specific shop)')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('The category of the shop you want to access')
            .setRequired(false)),
    details: {
        description: "Displays the full shop or a specific category of items available for purchase.",
        usage: "/shop category:<category>",
        examples: [
            "/shop",
            "/shop category:perks"
        ]
    },
    async execute(interaction, client) {
        await interaction.deferReply();

        const itemCategories = await Item.find();

        const categories = [...new Set(itemCategories.map(item => item.category))];

        const category = interaction.options.getString('category');

        let embedMessage = new EmbedBuilder()
            .setColor(0xD8BFD8)
            .setTitle('Shop')

        if (!category) {
            let categoryMessage = '';

            categories.forEach(category => {
                if (category !== 'untradeable') {
                    let capCategory = category.charAt(0).toUpperCase() + category.slice(1);
                    categoryMessage += capCategory + ' Shop' + " -> **" + category + "**\n";
                }
            });
            return interaction.editReply({embeds: [embedMessage.setDescription(categoryMessage)]});
        }

        if (!categories.includes(category)) return interaction.editReply({embeds: [embedMessage.setDescription('Invalid Category')]});

        let items = await Item.find({category: category});

        let capCategory = category.charAt(0).toUpperCase() + category.slice(1);

        let messageConcat = '';
        for (const item of items) {
            messageConcat += '<' + (item.emote).toString() + '> **' + (item.name).toString() + '** - <:boriscoin:798017751842291732>' + (item.price).toString() + ' -> ** buy ' + (item.name).toString() + '**\n';
        }

        return interaction.editReply({embeds: [embedMessage.setTitle(capCategory + ' Shop').setDescription(messageConcat)]})

    }
}