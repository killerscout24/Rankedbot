const { 
    Client, 
    GatewayIntentBits, 
    Collection, 
    REST, 
    Routes 
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

// Load the rank command (for the dropdown builder)
const rankCommand = require("./commands/rank.js");

// Bot ready
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// PREFIX COMMAND: !rank
client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "!rank") {
        // Send the dropdown menu
        return message.reply({
            content: "Select your Warzone rank:",
            components: [rankCommand.dropdownMenu()]
        });
    }
});

// Handle dropdown selection
client.on("interactionCreate", async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "rank_select") {
            const rank = interaction.values[0];
            const newNickname = `${interaction.member.user.username} ★ ${rank}`;

            try {
                await interaction.member.setNickname(newNickname);
                await interaction.reply({ 
                    content: `Rank updated to **${rank}**`, 
                    ephemeral: true 
                });
            } catch (err) {
                console.error(err);
                await interaction.reply({ 
                    content: "I couldn't change that nickname.", 
                    ephemeral: true 
                });
            }
        }
    }
});

client.login(process.env.TOKEN);
