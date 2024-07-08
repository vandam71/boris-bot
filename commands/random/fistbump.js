const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "random",
	data: new SlashCommandBuilder()
		.setName('fistbump')
		.setDescription("Fist bumps someone"),
	details: {
		description: "Allows the user to send a virtual fist bump to someone in the chat.",
		usage: "/fistbump",
		examples: ["/fistbump - Sends a virtual fist bump."]
	},
	async execute(interaction, client) {     
        await interaction.deferReply();

        interaction.editReply({ files: [{ attachment: 'https://i.imgur.com/oL0XUD8.png', name: "fistbump.jpg" }] });
	},
};