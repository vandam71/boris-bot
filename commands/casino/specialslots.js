const Transaction = require('../../struct/Transaction');
const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
	category: "casino",
    cooldown: 300,
	data: new SlashCommandBuilder()
        .setName('specialslots')
		.setDescription("Play a special slots game!")
        .addIntegerOption(option =>
            option.setName('value')
            .setDescription('The value you want to bet')
            .setRequired(true)),
        
    details: {
        description: `
Play this special game of slots and try your luck! Here are the win conditions:
- **60x** - **3 Jokers** 🎰 🎰 🎰
- **40x** - **3 Diamonds** 💎 💎 💎
- **20x** - **3 Cherries** 🍒 🍒 🍒
- **10x** - **3 of a kind** 🍊 🍌 🍋
- **3x** - **2 Cherries** 🍒 🍒
- **1x** - **1 Cherry** 🍒
        `,
        usage: "/specialslots value:<bet_amount>",
        examples: [
            "/specialslots value:50",
            "/specialslots value:100"
        ]
    },
    async execute(interaction, client) {
        await interaction.deferReply();

        const value = interaction.options.getInteger('value');

        if (!value) {
            return interaction.editReply({embeds : [new EmbedBuilder().setDescription("Please provide a bet value")]});
        }

        if (await User.getBalance(interaction.user.id) < value)
            return interaction.editReply({embeds : [new EmbedBuilder().setDescription("You don't have enough coins")]});

        let items1 = ['🎰', '💎', '💎', '💎', '🍒', '🍒', '🍒', '🍒', '🍊', '🍊', '🍊', '🍊', '🍊', '🍌', '🍌', '🍌', '🍌', '🍌', '🍋', '🍋', '🍋', '🍋', '🍋'];
        let items2 = ['🎰', '💎', '🍒', '🍒', '🍒', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍋', '🍋', '🍋', '🍋', '🍋', '🍋'];
        let items3 = ['🎰', '💎', '🍒', '🍒', '🍒', '🍊', '🍊', '🍊', '🍊', '🍊', '🍊', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍋', '🍋', '🍋', '🍋', '🍋', '🍋'];

        let $ = getRandomElement(items1);
        let $$ = getRandomElement(items2);
        let $$$ = getRandomElement(items3);

        let slotsEmbed = new EmbedBuilder()
            .setTitle("Special Slot Machine")
            .setColor(0xAF873D)
            .setDescription(`\`\`\`\u1CBC\u1CBC❌\u1CBC\u1CBC❌\u1CBC\u1CBC❌\u1CBC\u1CBC\`\`\``)
            .setFields({name: "Bet value: " + value + " <:boriscoin:798017751842291732>", value: '\t'});

        await interaction.editReply({embeds: [slotsEmbed]});

        setTimeout(async () => {
            await interaction.editReply({embeds: [slotsEmbed.setDescription(`\`\`\`\u1CBC\u1CBC${$}\u1CBC\u1CBC❌\u1CBC\u1CBC❌\u1CBC\u1CBC\`\`\``)]});
        }, 600)

        setTimeout(async () => {
            await interaction.editReply({embeds: [slotsEmbed.setDescription(`\`\`\`\u1CBC\u1CBC${$}\u1CBC\u1CBC${$$}\u1CBC\u1CBC❌\u1CBC\u1CBC\`\`\``)]});
        }, 1200)

        setTimeout(async () => {
            slotsEmbed.setDescription(`\`\`\`\u1CBC\u1CBC${$}\u1CBC\u1CBC${$$}\u1CBC\u1CBC${$$$}\u1CBC\u1CBC\`\`\``);
            if ($ === $$ && $ === $$$) {
                if ($ === '🎰') {
                    // 3 Jokers -> 60
                    await new Transaction(interaction.user.id, value * 59, 'Special Slots').process();
                    slotsEmbed.addFields({
                        name: 'Jackpot!',
                        value: "Big win! You won " + value * 60 + " <:boriscoin:798017751842291732>."
                    });
                } else if ($ === '💎') {
                    // 3 Diamonds -> 40
                    await new Transaction(interaction.user.id, value * 39, 'Special Slots').process();
                    slotsEmbed.addFields({
                        name: '3 Diamonds!',
                        value: "You won " + value * 40 + " <:boriscoin:798017751842291732>."
                    });
                } else if ($ === '🍒') {
                    // 3 Cherries -> 20
                    await new Transaction(interaction.user.id, value * 19, 'Special Slots').process();
                    slotsEmbed.addFields({
                        name: '3 Cherries!',
                        value: "You won " + value * 20 + " <:boriscoin:798017751842291732>."
                    });
                } else {
                    // 3 Other Fruits -> 10
                    await new Transaction(interaction.user.id, value * 9, 'Special Slots').process();
                    slotsEmbed.addFields({
                        name: '3 Of A Kind!',
                        value: "You won " + value * 10 + " <:boriscoin:798017751842291732>."
                    });
                }
            } else if (($ === $$ || $ === $$$) && ($ === '🍒') || (($$ === $$$) && ($$ === '🍒'))) {
                // 2 Cherries -> 3
                await new Transaction(interaction.user.id, value * 2, 'Special Slots').process();
                slotsEmbed.addFields({
                    name: '2 Cherries',
                    value: "You won " + value * 3 + " <:boriscoin:798017751842291732>."
                });
            } else if ($ === '🍒' || $$ === '🍒' || $$$ === '🍒') {
                // 1 Cherry - 1
                slotsEmbed.addFields({
                    name: '1 Cherry',
                    value: "You break even."
                });
            } else {
                await new Transaction(interaction.user.id, -value, 'Special Slots').process();
                slotsEmbed.addFields({
                    name: 'Lost...',
                    value: "Better luck next time."
                });
            }
            await interaction.editReply({embeds: [slotsEmbed]});
        }, 1800)
    }
}