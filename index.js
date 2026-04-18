const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load the rank command
const rankCommand = require("./commands/rank.js");
client.commands.set(rankCommand.data.name, rankCommand);

// Register slash commands when bot starts
client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                client.user.id,
                "618634431388844032"   // ← PUT YOUR SERVER ID HERE
            ),
            { body: [rankCommand.data.toJSON()] }
        );

        console.log("Guild slash commands registered instantly");
    } catch (err) {
        console.error(err);
    }
});

// Handle interactions
client.on("interactionCreate", async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) command.execute(interaction);
    }

    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "rank_select") {
            const rank = interaction.values[0];
            const newNickname = `${interaction.member.user.username} ★ ${rank}`;

            try {
                await interaction.member.setNickname(newNickname);
                await interaction.reply({ content: `Rank updated to **${rank}**`, ephemeral: true });
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: "I couldn't change that nickname.", ephemeral: true
