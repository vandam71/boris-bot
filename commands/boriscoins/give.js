const { User } = require('../../models/user');
const Transaction = require ('../../struct/Transaction');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	category: "boriscoins",
    cooldown: 20,
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription("Gives the selected amount of coins to other user.")
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('value').setDescription('The value you want to bet').setRequired(true)),
	details: {
		description: `Gives another user the amount of coins you choose.`,
		usage: "/give target:<@user> value:<coin_amount>",
		examples: [
			"/give target:@ElBoris value:50 - Gives 50 coins to the ElBoris user."
		]
	},
	async execute(interaction, client) {
        await interaction.deferReply();
		const user = interaction.options.getUser('target');
        const give_value = interaction.options.getInteger('value');

        if (!(await User.findOne({id: user.id}))) return interaction.editReply('This user cannot be found!');
        if (await User.getBalance(interaction.user.id) < give_value) return interaction.editReply('You dont have enough coins to give!');

        await new Transaction(interaction.user.id, -give_value, 'Give').process();
        await new Transaction(user.id, give_value, 'Give').process();

        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(0xAF873D)
                .setTitle('Give')
                .setDescription(`You gave ${user.displayName} ${give_value} <:boriscoin:798017751842291732>`)]
        });

	},
};