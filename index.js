const {
    Client,
    GatewayIntentBits,
    Collection,
    PermissionsBitField
} = require("discord.js");

const express = require("express");
const app = express();

// Keeps Render happy
app.get("/", (req, res) => {
    res.send("Ranked Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Web server started");
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

const rankCommand = require("./commands/rank.js");

// Rank emblems
const rankEmblems = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💎",
    Diamond: "🔷",
    Crimson: "🔥",
    Iridescent: "👑",
    Top250: "🏆"
};

// Bot ready
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Commands
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Open rank menu
    if (message.content.toLowerCase() === "!rank") {
        return message.reply({
            content: "Select your Warzone rank:",
            components: [rankCommand.dropdownMenu()]
        });
    }

    // Season reset
    if (message.content.toLowerCase() === "!seasonreset confirm") {

        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply("Admins only.");
        }

        const members = await message.guild.members.fetch();

        let count = 0;

        for (const member of members.values()) {
            try {
                await member.setNickname(null);
                count++;
            } catch (err) {
                console.log(`Couldn't reset ${member.user.tag}`);
            }
        }

        return message.reply(
            `✅ Season reset complete. Reset ${count} nicknames.`
        );
    }
});

// Rank selection
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === "rank_select") {

        const rank = interaction.values[0];

        const newNickname =
            `${interaction.member.user.username} ${rankEmblems[rank]}`;

        try {

            await interaction.member.setNickname(newNickname);

            await interaction.reply({
                content: `✅ Rank updated to ${rank}`,
                ephemeral: true
            });

        } catch (err) {

            console.error(err);

            await interaction.reply({
                content: "❌ I couldn't change that nickname. Check my permissions and role position.",
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);
