const { Events, Collection } = require('discord.js');
const { newUserInteraction } = require('../models/user');
const logger = require('../logger')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return interaction.reply({ content: 'There is no command with this name!', ephemeral: true });
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)){
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (timestamps.has(interaction.user.id)){
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				await interaction.reply({ 
					content: `Please wait, you are on a cooldown for \`${command.data.name}\` command. You can use it again <t:${expiredTimestamp}:R>.`, 
					ephemeral: true 
				})
				setTimeout(async () => {
					await interaction.editReply(`You can now use the \`${command.data.name}\` command again!`);
				}, expirationTime - now)
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => {
			timestamps.delete(interaction.user.id);
		}, cooldownAmount);

		await newUserInteraction(interaction.user);

		try {
			logger.command(`${interaction.user.tag} has used the "${command.data.name}" command`);
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			//logger.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};