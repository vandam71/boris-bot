const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { User } = require('../../models/user');
const Item = require('../../models/item');

module.exports = {
    category: "shop",
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Upgrades an item using an upgrade material')
        .addStringOption(option =>
            option.setName('item_name')
            .setDescription('The name of the item you want to upgrade')
            .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const materialID = [201, 202, 203, 204, 205];
        const baseRate = 40

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Upgrade')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm, cancel);
        
        const collectorFilter = i => i.user.id === interaction.user.id;

        let upgradeMessage = new EmbedBuilder()
            .setColor(0x8802A4)
            .setTitle('Upgrade Interface');

        const perkName = interaction.options.getString('item_name');

        let item = await Item.findOne({name: perkName});
        if (!item) 
            return interaction.editReply({embeds: [upgradeMessage.setDescription('Not a valid item name.')]});

        if (item.category !== 'perk')
            return interaction.editReply({embeds: [upgradeMessage.setDescription('You can only upgrade perk items.')]});

        const perks = await User.getPerks(interaction.user.id);
        let upgradePerk = perks.find(o => o.name === perkName)

        if (!upgradePerk)
            return interaction.editReply({embeds: [upgradeMessage.setDescription('You can only upgrade perk that you have already puchased.')]});

        if (upgradePerk.quantity >= 6) {
            return interaction.editReply({embeds: [upgradeMessage.setDescription('This perk is already max level!')]});
        }

        let material = await User.checkInventory(interaction.user.id, materialID[(upgradePerk.quantity - 1)]);
        let reqMaterial = await Item.findById(materialID[(upgradePerk.quantity - 1)]);

        if (!material) {
            return interaction.editReply({embeds: [upgradeMessage.setDescription("You don't have the required material to upgrade this Perk\n You need 1 <" + reqMaterial.emote + "> **" + reqMaterial.name + "**.")]});
        }

        let successRate = baseRate - (upgradePerk.quantity * 5);
        let upgradeSuccessful = Math.floor(Math.random() * 100) <= successRate;

        let perk = await Item.findById(upgradePerk.id);

        const response = await interaction.editReply({
            embeds: [upgradeMessage.setDescription("You are attempting to upgrade <" + perk.emote + "> **" + perk.name + "** to **Tier " + (upgradePerk.quantity + 1) + "**.\n It will consume **1** <" + reqMaterial.emote + "> **" + material.name + "** and it has a **" + successRate + "%** success rate.")], 
            components: [row]
        });

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
            if (confirmation.customId === 'confirm'){
                User.findOne({id: interaction.user.id}).then(async user => {
                    await user.removeItem(material.name);
                    
                    if (upgradeSuccessful){
                        await user.addItem(upgradePerk.name, upgradePerk.id);
                        await interaction.editReply({
                            embeds: [upgradeMessage.setDescription("You successfully upgraded <" + perk.emote + "> **" + perk.name + "** to **Tier " + (upgradePerk.quantity + 1) + "**.")], 
                            components: []
                        });
                    } else {
                        await interaction.editReply({
                            embeds: [upgradeMessage.setDescription("You failed to upgrade <" + perk.emote + "> **" + perk.name + "** to **Tier " + (upgradePerk.quantity + 1) + "**.\n Better luck next time!")], 
                            components: []
                        });
                    }
                    user.save()
                });
            } 
            else if (confirmation.customId === 'cancel') {
                return interaction.editReply({embeds: [upgradeMessage.setDescription("You declined the upgrade.")], components: []});
            }
        } 
        catch(e) {
            return interaction.editReply({embeds: [upgradeMessage.setDescription("Upgrade time has expired.")], components: []});
        }

    }
}