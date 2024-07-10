const { User } = require('../../models/user');
const Item = require('../../models/item');
const Transaction = require('../../struct/Transaction');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "boriscoins",
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription("Mine for some coins (and a chance on keys)"),
	details: {
		description: `
Initiates a mining process to earn <:boriscoin:798017751842291732>, with a chance to find keys.
- <:bronze_key:842116583471710288> Bronze Key: 1/100
- <:gold_key:842116583471841280> Gold Key: 1/1000
\n**Perks available**
- <:perk_speed:842116583676444672> Speed Perk - Decreases the mining duration for 5 seconds each perk tier
- <:perk_luck:842141817990152212> Luck Perk - Plus one <:boriscoin:798017751842291732> each mining iteration
`,
		usage: "/mine",
		examples: [
			"/mine - Initiates the mining process to earn <:boriscoin:798017751842291732>."
		]
	},
	async execute(interaction, client) {

		if (client.minedRecently.has(interaction.user.id))
            return interaction.reply({content: 'You are still mining, please let it finish before using this command again.', ephemeral: true});
        client.minedRecently.add(interaction.user.id);

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
			.setDescription(`The mining process has started. It will take **${(miningCooldown) - (5 * speedValue)}** seconds.\n`)

		const perksString = [];
		if (speedValue !== 0) {
			perksString.push("<:perk_speed:842116583676444672> Speed Perk level " + speedValue);
		}
		if (luckValue !== 0) {
			perksString.push("<:perk_luck:842141817990152212> Luck Perk level " + luckValue);
		}
		if (perksString.length > 0) {
			embed.addFields({ name: "Perks Used:", value: perksString.join("\n") });
		}

		interaction.editReply({ embeds: [embed] });

		setTimeout(async () => {
			client.minedRecently.delete(interaction.user.id);
			let value = await new Transaction(interaction.user.id, (Math.floor(Math.random() * 5) + 1 + luckValue), "Mining").process();
			embed.setTitle('Mined!')
				.setDescription(`you have mined <:boriscoin:798017751842291732> **${value}**`);

			// roll for a bonus item
            // if bonus item, add field to the message, otherwise, keep going
			let bronze_drop = Math.floor(Math.random() * 100) === 0;
			let gold_drop = Math.floor(Math.random() * 1000) === 0;
	
			if (bronze_drop || gold_drop) {
				const promises = [];
	
				if (bronze_drop) {
					promises.push(User.findOne({ id: interaction.user.id }).then(async user => {
						await user.addItem("Bronze Key", 801);
						user.save();
						return '<:bronze_key:842116583471710288> Bronze Key';
					}));
				}
	
				if (gold_drop) {
					promises.push(User.findOne({ id: interaction.user.id }).then(async user => {
						await user.addItem("Gold Key", 802);
						user.save();
						return '<:gold_key:842116583471841280> Gold Key';
					}));
				}
	
				const results = await Promise.all(promises);
				embed.addFields({ name: 'Item Drop:', value: results.join('\n') });
			}
	
			interaction.editReply({ embeds: [embed] });
		}, ((miningCooldown * 1000) - (5000 * speedValue)));
	},
};