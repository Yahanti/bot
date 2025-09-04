const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = process.env.DISCORD_TOKEN;
let backendUrl = process.env.VERCEL_URL;

if (backendUrl && !backendUrl.startsWith('http')) {
  backendUrl = `https://${backendUrl}`;
}

client.once('clientReady', () => {
    console.log(`Bot online como ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'gerarcodigo') {
        try {
            // A linha abaixo envia a requisição para o seu servidor no Vercel.
            const response = await axios.post(`${backendUrl}/api/generate-code`);
            const { code } = response.data;
            
            message.channel.send(`**Código de acesso gerado:** \`${code}\`\nEste código é válido por 15 minutos.`);
        } catch (error) {
            console.error('Erro ao gerar código:', error.message);
            message.channel.send('Não foi possível gerar um código no momento. Por favor, tente novamente.');
        }
    }
});

client.login(token);