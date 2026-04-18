const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Select your Warzone rank"),

    dropdownMenu() {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("rank_select")
                .setPlaceholder("Choose your rank")
                .addOptions([
                    { label: "Bronze", value: "Bronze" },
                    { label: "Silver", value: "Silver" },
                    { label: "Gold", value: "Gold" },
                    { label: "Platinum", value: "Platinum" },
                    { label: "Diamond", value: "Diamond" },
                    { label: "Crimson", value: "Crimson" },
                    { label: "Iridescent", value: "Iridescent" },
                    { label: "Top 250", value: "Top 250" }
                ])
        );
    },

    async execute(interaction) {
        await interaction.reply({
            content: "Select your Warzone rank:",
            components: [this.dropdownMenu()],
            ephemeral: true
        });
    }
};

