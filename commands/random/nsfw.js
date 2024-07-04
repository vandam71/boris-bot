const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const logger = require('../../logger');

module.exports = {
    category: "random",
    cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('nsfw')
		.setDescription('Returns a nsfw image!')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('The category of the nsfw image')
                .setRequired(true)
                .addChoices(
                    { name: 'boobs', value: 'boobs' },
                    { name: 'pussy', value: 'pussy' },
                    { name: 'gonewild', value: 'gonewild' },
                    { name: 'food', value: 'food' },
                )
            ),
	async execute(interaction, client) {
        if (!interaction.channel.nsfw) {
            interaction.reply('This command can only be executed in a NSFW channel!');
            return;
        }

		await interaction.deferReply({ephemeral:true});

        const category = interaction.options.getString('category');

        axios.get('https://nekobot.xyz/api/image', {
            params: {
                type: category,
            },
            timeout: 10000
        })
        .then(res => interaction.editReply({ files: [{ attachment: res.data.message, name: "nsfw.jpg" }] }))
        .catch(() => interaction.editReply("I can't give you an image at this instant!"));
	},
};