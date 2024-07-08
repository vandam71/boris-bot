const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "utility",
	cooldown: 5,
	details: {
        description: "Replies with Pong! and displays the roundtrip latency.",
        usage: "/ping",
        examples: ["/ping"]
    },
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const sent = await interaction.editReply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};