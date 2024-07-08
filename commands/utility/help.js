const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "utility",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Get info about a command or list commands by category")
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Command name')),
    details: {
        description: "Get information about a specific command or list all commands categorized.",
        usage: "/help command:<command_name>",
        examples: [
            "/help command:ping - Provides information about the 'ping' command.",
            "/help - Lists all available commands categorized."
        ]
    },
    async execute(interaction, client) {
        const commandName = interaction.options.getString('command');

        if (!commandName) {
            // Group commands by category
            const categories = {};
            client.commands.forEach(cmd => {
                if (!categories[cmd.category]) {
                    categories[cmd.category] = [];
                }
                categories[cmd.category].push(cmd.data.name);
            });

            // Create embed for each category
            let embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('Commands by Category');

            for (const [category, commands] of Object.entries(categories)) {
                embed.addFields({ name: category, value: commands.join(', ') });
            }

            return interaction.reply({ embeds: [embed] });
        }

        const command = client.commands.get(commandName);

        if (!command) {
            return interaction.reply({ content: 'Command not found!', ephemeral: true });
        }

        let { cooldown, details } = command;

        let embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle(`Command: ${commandName}`);

        if(details){
            if(details.description)
                embed.addFields({ name: 'Description', value: details.description });
            if(details.usage)
                embed.addFields({ name: 'Usage', value: details.usage });
            if(details.examples)
                embed.addFields({ name: 'Examples', value: details.examples.join('\n') });
        }

        if (cooldown)
            embed.addFields({ name: 'Cooldown', value: cooldown.toString() + " seconds"});

        return interaction.reply({ embeds: [embed] });
    },
};