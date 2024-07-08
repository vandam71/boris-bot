const { User } = require('../../models/user');
const Item = require('../../models/item');
const Transaction = require ('../../struct/Transaction');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	category: "boriscoins",
    cooldown: 20,
	data: new SlashCommandBuilder()
		.setName('chest')
		.setDescription("Opens a chest using the given key.")
        .addStringOption(option => 
            option.setName('key')
                .setDescription('The key you want to use to open the chest.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bronze Key', value: 'Bronze Key' },
                    { name: 'Gold Key', value: 'Gold Key' },
                )
            ),
	details: {
		description: `
You open a chest using a key from the inventory.
- <:bronze_key:842116583471710288> Bronze Key: 300 to 400 <:boriscoin:798017751842291732> and 200 to 300 <:xp:801554148994056202>
- <:gold_key:842116583471841280> Gold Key: 2000-3000 <:boriscoin:798017751842291732> and 500 to 1000 <:xp:801554148994056202>
`,
		usage: "/chest key:<Bronze Key/Gold Key>",
		examples: [
			"/chest key:Bronze Key - Opens the chest using a bronze key."
		]
	},
	async execute(interaction, client) {
        await interaction.deferReply();

        const key = interaction.options.getString('key');
        const keyObj = await User.checkInventory(interaction.user.id, (await Item.findOne({ name: key })).id);

        if (!keyObj) {
            return interaction.editReply({embeds: [new EmbedBuilder().setTitle('Failed').setDescription("You don't have this key!")]});
        }

        let coinsRoll, xpRoll, chestTitle;

        if (key === 'Bronze Key') {
            coinsRoll = Math.floor(Math.random() * (400 - 300 + 1)) + 300;
            xpRoll = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
            chestTitle = 'Bronze Chest';
        } else if (key === 'Gold Key') {
            coinsRoll = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
            xpRoll = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
            chestTitle = 'Gold Chest';
        }
        
        await new Transaction(interaction.user.id, coinsRoll, 'Chest').process();
        let user = await User.findOne({ id: interaction.user.id });
        await user.removeItem(key);
        await user.addExperience(xpRoll);
        await user.save();
    
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle(chestTitle)
                .setDescription(`You received <:boriscoin:798017751842291732> ${coinsRoll} and <:xp:801554148994056202> ${xpRoll} from the chest.`)
            ]
        });
        
	},
};