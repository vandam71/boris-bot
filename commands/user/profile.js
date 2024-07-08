const {User} = require('../../models/user');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: "user",
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription("Retrieves the user's profile"),
    details: {
        description: "Retrieves and displays the user's profile including level, experience, coins, and inventory.",
        usage: "/profile",
        examples: ["/profile"]
    },
	async execute(interaction, client) {
        await interaction.deferReply();
        let user = await User.findOne({id: interaction.user.id});

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(`${interaction.user.username}'s Profile`)
            .addFields({
                name: "Stats", 
                value: `**Level: ${user.level}**\n
                <:xp:801554148994056202> Experience: **${user.xp}**\n
                <:boriscoin:798017751842291732> Coins: **${user.coins}**\n
                Azia: **${user.azia}**`},{
                name: "Inventory",
                value: user.inventory.length + ' items'})
            .setThumbnail(interaction.user.avatarURL());

        interaction.editReply({embeds:[embed]});
	},
};