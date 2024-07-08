const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "user",
	data: new SlashCommandBuilder()
		.setName('peek')
		.setDescription("Retrieves the selected user's profile")
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true)),
    details: {
        description: "Retrieves and displays the profile of the selected user including level, experience, and Azia.",
        usage: "/peek target:<@user>",
        examples: ["/peek target:@ElBoris"]
    },
	async execute(interaction, client) {
        await interaction.deferReply();
		const userID = interaction.options.getUser('target');

        let user = await User.findOne({id: userID.id});

        if (!user) return interaction.editReply('This user cannot be found!');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(`${userID.username}'s Profile`)
            .addFields({name: "Stats", value: `**Level: ${user.level}**\n<:xp:801554148994056202> Experience: **${user.xp}**\nAzia: **${user.azia}**`})
            .setThumbnail(userID.avatarURL());

        interaction.editReply({embeds:[embed]});
	},
};