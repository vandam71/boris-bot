const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const welcome = require('../../models/welcome');



module.exports = {
	category: "utility",
	data: new SlashCommandBuilder().setName('welcome').setDescription('Manage the welcome system')
        .addSubcommand(subcommand => subcommand.setName('setup').setDescription('Sets up the welcome system')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Please select a channel for the welcome system')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
            .addStringOption(option => option
                .setName('message')
                .setDescription('The message that gonna be sent. Note: use {member} to ping and (member) to show username')
                .setRequired(true))
            .addStringOption(option => option
                .setName('reaction')
                .setDescription('The reaction for your system')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disables the welcome system')),
	async execute(interaction, client) {
        await interaction.deferReply();

        const miningCooldown = 10;
	},
};