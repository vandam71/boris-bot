const {User} = require('../../models/user');
const Transaction = require('../../struct/Transaction');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "boriscoins",
    cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription("Mine for some coins (and a chance on keys)\nBronze Key: 1/100\nGold Key: 1/1000"),
	async execute(interaction, client) {
        await interaction.deferReply();

        const miningCooldown = 30;

		const perks = await User.getPerks(interaction.user.id);

		const speedPerk = perks.find(o => o.name === 'Speed Perk');
		const luckPerk = perks.find(o => o.name === 'Luck Perk');

		const speedValue = ((!speedPerk) ? 0 : speedPerk.quantity);
        const luckValue = ((!luckPerk) ? 0 : luckPerk.quantity);

		const embed = new EmbedBuilder()
			.setColor(0xAF873D)
            .setTitle('Mining...')
            .setDescription(`The mining process has started. It will take **${(miningCooldown) - (5 * speedValue)}** seconds.\n`);
		
		interaction.editReply({embeds:[embed]});

		setTimeout(async () => {
			let value = await new Transaction(interaction.user.id, (Math.floor(Math.random() * 5) + 1 + luckValue), "Mining").process();
			embed.setTitle('Mined!')
				.setDescription(`you have mined <:boriscoin:798017751842291732> **${value}**`);
			interaction.editReply({embeds:[embed]});
		}, ((miningCooldown * 1000) - (5000 * speedValue)));
	},
};