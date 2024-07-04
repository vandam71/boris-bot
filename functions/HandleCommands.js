// Import necessary modules from discord.js and the file system module
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const logger = require('../logger');

module.exports = (client) => {
    // Define a function on the client to handle loading and registering commands
    client.handleCommands = async (token, commandFolders, path, clientId, guildId = null) => {
        // Initialize an array to hold the commands for registration
        client.commandArray = [];

        // Loop through each command folder
        for (const folder of commandFolders) {
            // Read command files from each folder
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            // Loop through each command file
            for (const file of commandFiles) {
                // Import the command module
                const command = require(`../commands/${folder}/${file}`);
                // Add the command to the client's command collection
                client.commands.set(command.data.name, command);
                // Prepare the command data for registration with Discord's API
                client.commandArray.push(command.data.toJSON());
            }
        }

        // Initialize the REST client with the bot's token
        const rest = new REST().setToken(token);
		// Store the total number of commands for logging purposes
		const totalCommands = client.commandArray.length;
		
        // Self-invoking async function to register commands
        (async () => {
            try {
                logger.info('Started refreshing (/) commands.');

                // Check if the clientId is provided, if not, log an error
                if (!clientId) {
                    logger.error('No client id provided.');
                    return;
                }

				// If a guildId is provided, register the commands for that specific guild
				if (guildId) {
					await rest.put(
						Routes.applicationGuildCommands(clientId, guildId), { body: client.commandArray }
					);
					logger.info(`Successfully reloaded (/) commands for guild. ${totalCommands} commands loaded.`);
					return;
				} else {
					// Otherwise, register the commands globally
					await rest.put(
						Routes.applicationCommands(clientId), { body: client.commandArray }
					);
					logger.info(`Successfully reloaded (/) commands globally. ${totalCommands} commands loaded.`);
					return;
				}
            } catch (error) {
                // Log any errors encountered during command registration
                logger.error('Failed to reload (/) commands:', error);
            }
        })();
    };
};