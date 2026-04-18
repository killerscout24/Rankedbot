const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Select your Warzone rank"),

    // Dropdown builder for BOTH slash + prefix
    dropdownMenu() {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("rank_select")
                .setPlaceholder("Choose your rank")
                .addOptions([
                    { label: "Bronze 1", value: "Bronze 1" },
                    { label: "Bronze 2", value: "Bronze 2" },
                    { label: "Silver 1", value: "Silver 1" },
                    { label: "Silver 2", value: "Silver 2" },
                    { label: "Gold 1", value: "Gold 1" },
                    { label: "Gold 2", value: "Gold 2" },
                    { label: "Platinum 1", value: "Platinum 1" },
                    { label: "Platinum 2", value: "Platinum 2" },
                    { label: "Diamond 1", value: "Diamond 1" },
                    { label: "Diamond 2", value: "Diamond 2" },
                    { label: "Crimson", value: "Crimson" },
                    { label: "Iridescent", value: "Iridescent" }
                ])
        );
    },

    // Slash command version (still works if needed)
    async execute(interaction) {
        await interaction.reply({
            content: "Select your Warzone rank:",
            components: [this.dropdownMenu()],
            ephemeral: true
        });
    }
};
