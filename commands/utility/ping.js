const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "utility",
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const sent = await interaction.editReply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};