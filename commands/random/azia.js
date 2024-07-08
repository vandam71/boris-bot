const {User} = require('../../models/user');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "random",
    cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('azia')
		.setDescription("Azia alguém")
        .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true)),
    details: {
        description: "Increments the 'azia' count for a specified user.",
        usage: "/azia target:<@user>",
        examples: ["/azia target:@ElBoris - Increments the 'azia' count for the mentioned user."]
    },
	async execute(interaction, client) {
        await interaction.deferReply();
		const userID = interaction.options.getUser('target');

        User.findOneAndUpdate({id: userID.id}, {$inc: {azia: 1}}).then(user => {
            if (user === null){
                interaction.editReply("This user hasn't talked in this server yet.");
                return;
            }
            interaction.editReply(`O <@${(userID.id).toString()}> já aziou ${user.azia + 1} vezes.`);
        });
	},
};