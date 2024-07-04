const Item = require('../../models/item');
const {User} = require('../../models/user');
const Transaction = require('../../struct/Transaction');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "shop",
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buys an item from the shop')
        .addStringOption(option =>
            option.setName('item_name')
            .setDescription('The name of the item you want to puchase')
            .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        let buyMessage = new EmbedBuilder()
            .setColor(0xD8BFD8)
            .setTitle('Buy');

        const itemName = interaction.options.getString('item_name');

        let item = await Item.findOne({name: itemName});
        if (!item) 
            return interaction.editReply({embeds: [buyMessage.setDescription('Not a valid Item')]});

        if (await User.getBalance(interaction.user.id) < item.price)
            return interaction.editReply({embeds: [buyMessage.setDescription('Not enough money!')]});

        if (item.category === 'untradeable')
            return interaction.editReply({embeds: [buyMessage.setDescription('**Untradeable**')]});

        // this check needs to be made before the add, because the addItem doesn't check if it's a perk
        // the addItem is made to be global, so it just adds of updates the item
        if (item.category === 'perk' && (await User.checkInventory(interaction.user.id, item.id))){
            return interaction.editReply({embeds: [buyMessage.setDescription(`You already have this perk, try upgrading it **upgrade ${item.name}**`)]});
        }

        User.findOne({id: interaction.user.id}).then(async user => {
            await user.addItem(item.name, item.id);
            user.save();
            await new Transaction(interaction.user.id, -item.price, 'Buy').process();
            return interaction.editReply({embeds: [buyMessage.setDescription("You bought <" + item.emote + "> " + item.name + " for <:boriscoin:798017751842291732> " + item.price + ".")]});
        });
    }
}