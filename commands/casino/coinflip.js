const Transaction = require('../../struct/Transaction');
const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "casino",
    cooldown: 5,
	data: new SlashCommandBuilder()
        .setName('coinflip')
		.setDescription("Flip a coin with 50% chance of winning")
        .addStringOption(option => 
            option.setName('side')
                .setDescription('The side of the coin you want to choose')
                .setRequired(true)
                .addChoices(
                    { name: 'tails', value: 'tails' },
                    { name: 'heads', value: 'heads' },
                )
            )
        .addIntegerOption(option =>
            option.setName('value')
            .setDescription('The value you want to bet')
            .setRequired(true)
        ),
    details: {
        description: `
Flip a coin and try your luck with a 50% chance of winning! Choose heads or tails and bet an amount of coins.
- If the coin lands on your chosen side, you win the amount you bet.
- If the coin lands on the opposite side, you lose the amount you bet.
`,
        usage: "/coinflip side:<heads/tails> value:<bet_amount>",
        examples: [
            "/coinflip side:heads value:50",
            "/coinflip side:tails value:100"
        ]
    },
    async execute(interaction, client) {
        await interaction.deferReply();

        const side = interaction.options.getString('side');
        const value = interaction.options.getInteger('value');

        if (await User.getBalance(interaction.user.id) < value)
            return interaction.editReply({embeds : [new EmbedBuilder().setDescription("You don't have enough coins")]});

        let flipMessage = new EmbedBuilder()
            .setColor(0xD8BFD8)
            .setTitle('Coin Flip 🪙');

        let coin = ((Math.round(Math.random()) === 0) ? 'heads' : 'tails');

        switch(side){
            case 'heads':
                if (coin === "heads"){
                    // Picked heads and won
                    await new Transaction(interaction.user.id, value, 'Coinflip').process();
                    flipMessage.setDescription('You flip a coin, and it lands on Heads. You won ' + value + " <:boriscoin:798017751842291732>.");
                } else {
                    // Picked heads and lost
                    await new Transaction(interaction.user.id, -value, 'Coinflip').process();
                    flipMessage.setDescription('You flip a coin, and it lands on Tails. You lost ' + value + " <:boriscoin:798017751842291732>.");
                }
                break;
            case 'tails':
                if (coin === "tails"){
                    // Picked tails and won
                    await new Transaction(interaction.user.id, value, 'Coinflip').process();
                    flipMessage.setDescription('You flip a coin, and it lands on Tails. You won ' + value + " <:boriscoin:798017751842291732>.");
                } else {
                    // Picked tails and lost
                    await new Transaction(interaction.user.id, -value, 'Coinflip').process();
                    flipMessage.setDescription('You flip a coin, and it lands on Heads. You lost ' + value + " <:boriscoin:798017751842291732>.");
                }
                break;
        }
        return interaction.editReply({embeds: [flipMessage.addFields({name: "Bet value: " + value, value: '\t'})]});
    }
}