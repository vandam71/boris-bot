const {User} = require('../../models/user');
const Item = require('../../models/item');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "user",
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription("Retrieves the user's inventory"),
	async execute(interaction, client) {
        
        await interaction.deferReply();
        const user = await User.findOne({id: interaction.user.id});
        const inventory = user.inventory;

        let embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Inventory')

        if(!(inventory.length > 0))
            return interaction.editReply({embeds: [embed.setDescription('Empty')]});

        let messageConcat = ''
        for(const item of inventory){
            messageConcat += await Item.getItemString(item.id, item.quantity)
        }

        return interaction.editReply({embeds: [embed.setDescription(messageConcat)]})
	},
};