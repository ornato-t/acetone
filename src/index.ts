import 'dotenv/config';
import { Client, GatewayIntentBits, Message } from "discord.js";
import { isTarget } from './image';

const TOLERANCE = 0.15;
const testRegex = /<:\S+:[0-9]{19}>/;
const extractRegex = /<:\S+:([0-9]{19})>/g;

const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(token);

client.on('messageCreate', async (message) => {
    const content = message.content;

    if (!testRegex.test(content)) return;   //Check if the message contains any emoji
    const emoji = Array.from(content.matchAll(extractRegex), m => m[1]);    //Extract the ids of all emoji in the message

    for (const entry of emoji) {
        if (await isTarget(entry, TOLERANCE)) {
            await moderate(message);
            return;
        }
    }
});

async function moderate(message: Message) {
    console.log('Delete this:', message.id)
}