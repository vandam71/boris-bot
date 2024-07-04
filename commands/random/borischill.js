const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "random",
	data: new SlashCommandBuilder()
		.setName('borischill')
		.setDescription("Chillin with the hoes"),
	async execute(interaction, client) {     
        await interaction.deferReply();

        interaction.editReply({ files: [{ attachment: 'https://i.imgur.com/B6gebu9.png', name: "borischill.jpg" }] });
	},
};