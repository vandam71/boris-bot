const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "random",
    cooldown: 15,
	data: new SlashCommandBuilder()
        .setName('levelup')
		.setDescription("Check how much XP you need to level up"),
    details: {
        description: "Allows users to check how much XP they need to reach the next level.",
        usage: "/levelup",
        examples: ["/levelup - Checks how much XP is needed to reach the next level."]
    },
    async execute(interaction, client) {
        const user = await User.findOne({id: interaction.user.id});
        let req_xp = 69 * (user.level + 1) * (1 + (user.level + 1));

        let embed = new EmbedBuilder()
            .setColor(0xACA19D)
            .setTitle("You're almost there")
            .setDescription(`You still need \`${req_xp - user.xp}\` <:xp:801554148994056202> to reach level \`${user.level+1}\`. Keep spamming!`);

        return interaction.reply({embeds: [embed]});
    }
}