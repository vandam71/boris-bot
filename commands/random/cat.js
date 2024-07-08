const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const logger = require('../../logger');

module.exports = {
    category: "random",
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Sends a random cat picture!'),
	details: {
		description: "Sends a random cat picture.",
		usage: "/cat",
		examples: ["/cat - Sends a random picture of a cat."]
	},
	async execute(interaction, client) {
		await interaction.deferReply();

        axios.get('https://api.thecatapi.com/v1/images/search')
			.then(response => {
				const imageUrl = response.data[0].url;
				interaction.editReply({ files: [{ attachment: imageUrl, name: "cat.jpg" }] });
			})
			.catch(error => {
				logger.error(error);
			});
	},
};