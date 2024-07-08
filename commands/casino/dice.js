const Transaction = require('../../struct/Transaction');
const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	category: "dice",
    cooldown: 5,
	data: new SlashCommandBuilder()
        .setName('dice')
		.setDescription("Challenge your friends for a game of dice!")
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
        .addIntegerOption(option => option.setName('value').setDescription('The amount you want to bet').setRequired(true)),
    details: {
        description: `You can roll a dice with your frieds. If you roll a higher value than them, you win the game, otherwise, you lose! 
        The rolls are between 0 and 100. 
        You win/lose the amount you bet.`,
        usage: "/dice target:<@user> value:<bet_amount>",
        examples: [
            "/dice target:@ElBoris value:50 - Ask ElBoris for a game of dice with a bet value of 50"
        ]
    },
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const betAmount = interaction.options.getInteger('value');
        const userOption = interaction.options.getUser('target');

        let diceMessage = new EmbedBuilder()
            .setColor(0xAF873D)
            .setTitle('Dice Challenge')

        if (!(await User.findOne({id: userOption.id}))) return interaction.editReply({embeds: [diceMessage.setDescription('This user cannot be found!')]});
        if (betAmount === 0) return interaction.editReply({embeds: [diceMessage.setDescription('You need to bet something!')]});
        if (await User.getBalance(interaction.user.id) < betAmount) return interaction.editReply({embeds: [diceMessage.setDescription('You dont have this amount of coins to bet!')]});
        if (await User.getBalance(userOption.id) < betAmount) return interaction.editReply({embeds: [diceMessage.setDescription('Your oponent does not have enough coins to accept the challenge!')]});

        // Active Dice check
        if (client.activeDice.has(interaction.user.id) || client.activeDice.has(userOption.id))
            return interaction.editReply({embeds: [diceMessage.setDescription('Either you or your opponent have an active dice!')]});
        client.activeDice.add(interaction.user.id);
        client.activeDice.add(userOption.id);

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm, cancel);
        
        const collectorFilter = i => i.user.id === userOption.id;

        const ownRoll = Math.floor(Math.random() * 100) + 1;
        const otherRoll = Math.floor(Math.random() * 100) + 1;

        const response = await interaction.editReply({
            embeds: [diceMessage.setDescription(`You have challenged **${userOption.displayName}**. Total value in the bet: **${betAmount}** <:boriscoin:798017751842291732>`)], 
            components: [row]
        });

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
            if (confirmation.customId === 'confirm'){
                const win = ownRoll >= otherRoll;
                const winner = win ? interaction.user : userOption;
                const loser = win ? userOption : interaction.user;

                await new Transaction(winner.id, betAmount, 'Dice').process();
                await new Transaction(loser.id, -betAmount, 'Dice').process();

                const resultMessage = win
                    ? `**${interaction.user.displayName}** won the dice with a roll of **${ownRoll}** vs **${otherRoll}**, and received **${betAmount}** <:boriscoin:798017751842291732>`
                    : `**${userOption.displayName}** won the dice with a roll of **${otherRoll}** vs **${ownRoll}**, and received **${betAmount}** <:boriscoin:798017751842291732>`;

                client.activeDice.delete(interaction.user.id);
                client.activeDice.delete(userOption.id);

                return interaction.editReply({ embeds: [diceMessage.setDescription(resultMessage)], components: [] });

            } else if (confirmation.customId === 'cancel'){
                client.activeDice.delete(interaction.user.id);
                client.activeDice.delete(userOption.id);
                return interaction.editReply({embeds: [upgradeMessage.setDescription("The challenge has been declined.")], components: []});
            }
        }
        catch(e) {
            client.activeDice.delete(interaction.user.id);
            client.activeDice.delete(userOption.id);
            return interaction.editReply({embeds: [diceMessage.setDescription('Challenge accept time expired.')], components: []});
        }

    }
}