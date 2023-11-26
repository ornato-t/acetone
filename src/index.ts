import 'dotenv/config';
import { Client, GatewayIntentBits, Message, Partials } from "discord.js";
import { isTarget } from './image';

const TOLERANCE = 0.15;
const testRegex = /<:\S+:[0-9]{19}>/;
const extractRegex = /<:\S+:([0-9]{19})>/g;
const emojiRegex = /💅/;

const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Reaction]
});

client.login(token);

//Remove forbidden messages
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

    async function moderate(message: Message) {
        await message.delete(); //Delete cringe message

        await message.author.send(`### Nail polish emoji detected, message removed:\n > ${message.content}`);   // Send a DM to the cringe user
    }
});

//Remove forbidden emoji
client.on('messageReactionAdd', async (react) => {
    const id = react.emoji.id;
    const name = react.emoji.name ?? '';

    if (id && await isTarget(id, TOLERANCE)) {   //Custom emoji
        removeReaction(id);

    } else if (emojiRegex.test(name)) {    //Unicode emoji
        removeReaction(name);

    }

    function removeReaction(emoji: string) {
        const reactions = react.message.reactions.cache.get(emoji);

        if (!reactions) return;

        reactions.remove();
    }
});
