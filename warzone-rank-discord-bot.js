
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Ranks (must match Discord role names exactly)
const ranks = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crimson",
  "Iridescent",
  "Top250"
];

// Create dropdown menu
function createRankMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("rank_select")
      .setPlaceholder("Select your Warzone rank")
      .addOptions(
        ranks.map(rank => ({
          label: rank,
          value: rank
        }))
      )
  );
}

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Command to open menu
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.content.trim() === "!rank") {
    msg.channel.send({
      content: "Choose your Warzone rank:",
      components: [createRankMenu()]
    });
  }
});

// Handle selection
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === "rank_select") {
      const rank = interaction.values[0];
      const member = interaction.member;

      // remove old ranks
      for (const r of ranks) {
        const oldRole = interaction.guild.roles.cache.find(x => x.name === r);
        if (oldRole) await member.roles.remove(oldRole).catch(() => {});
      }

      // add new role
      const newRole = interaction.guild.roles.cache.find(r => r.name === rank);
      if (newRole) await member.roles.add(newRole);

      // 🔥 SET NICKNAME (THIS IS WHAT YOU WANTED)
      const newNick = `${member.user.username} ★ ${rank}`;

      await member.setNickname(newNick).catch(() => {
        console.log("Missing permission to change nickname");
      });

      await interaction.reply({
        content: `Rank set to **★ ${rank}**`,
        ephemeral: true
      });
    }
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.TOKEN);