const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.DISCORD_TOKEN;
let backendUrl = process.env.VERCEL_URL;

if (backendUrl && !backendUrl.startsWith("http")) {
  backendUrl = `https://${backendUrl}`;
}

client.once("clientReady", () => {
    console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "pingapi") {
    try {
      const response = await axios.get(`${backendUrl}/api/status`);
      return message.reply(`✅ API respondeu: ${response.data.message}`);
    } catch (err) {
      return message.reply("❌ Erro ao conectar com o backend.");
    }
  }

  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }
});

client.login(token);
