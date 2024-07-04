const Transaction = require('../../struct/Transaction');
const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "casino",
    cooldown: 15,
	data: new SlashCommandBuilder()
        .setName('slots')
		.setDescription("Play the slots game!")
        .addIntegerOption(option =>
            option.setName('value')
            .setDescription('The value you want to bet')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('help')
            .setDescription('Get detailed information about the slots game')
            .setRequired(false)
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        if (interaction.options.getBoolean('help')){
            return interaction.editReply({embeds: [new EmbedBuilder()
                .setTitle("Slot Machine")
                .setColor(0xAF873D)
                .addFields({
                    name: "**Win** - **Combination**",
                    value: "30x - 3 Jokers 🎰 🎰 🎰\n10x - Any 3 Fruit 🍎 🍇 🍋 🍌 🍒 \n4x - Any 2 Jokers 🎰 🎰\n1x - Any 1 Joker 🎰"
                })]})
        }

        const value = interaction.options.getInteger('value');

        if (!value) {
            return interaction.editReply({embeds : [new EmbedBuilder().setDescription("Please provide a bet value")]});
        }

        if (await User.getBalance(interaction.user.id) < value)
            return interaction.editReply({embeds : [new EmbedBuilder().setDescription("You don't have enough coins")]});

        let items = ['🎰', '🍎', '🍇', '🍋', '🍌', '🍒'];

        let $ = items[Math.floor(items.length * Math.random())];
        let $$ = items[Math.floor(items.length * Math.random())];
        let $$$ = items[Math.floor(items.length * Math.random())];

        let slotsEmbed = new EmbedBuilder()
            .setTitle("Slot Machine")
            .setColor(0xAF873D)
            .setDescription(`\`\`\`\u1CBC\u1CBC${$}\u1CBC\u1CBC${$$}\u1CBC\u1CBC${$$$}\u1CBC\u1CBC\`\`\``)
            .setFields({name: "Bet value: " + value, value: '\t'});

        if ($ === $$ && $ === $$$) {
            if ($ === '🎰') {
                await new Transaction(interaction.user.id, value * 29, 'Slots').process();
                slotsEmbed.addFields({
                    name: 'Jackpot!',
                    value: "Big win! You won " + value * 30 + " <:boriscoin:798017751842291732>."
                })
            } else {
                await new Transaction(interaction.user.id, value * 9, 'Slots').process();
                slotsEmbed.addFields({
                    name: '3 of a kind!',
                    value: "You won " + value * 10 + " <:boriscoin:798017751842291732>."
                })
            }
        } else if (($ === $$ || $ === $$$) && ($ === '🎰') || (($$ === $$$) && ($$ === '🎰'))) {
            await new Transaction(interaction.user.id, value * 3, 'Slots').process();
            slotsEmbed.addFields({
                name: '2 Jokers!',
                value: "You won " + value * 4 + " <:boriscoin:798017751842291732>."
            })
        } else if ($ === '🎰' || $$ === '🎰' || $$$ === '🎰') {
            slotsEmbed.addFields({
                name: '1 Joker!',
                value: "You break even!"
            })
        } else {
            await new Transaction(interaction.user.id, -value, 'Slots').process();
            slotsEmbed.addFields({
                name: 'Lost...',
                value: "Better luck next time."
            })
        }

        return interaction.editReply({embeds: [slotsEmbed]});
    }
}