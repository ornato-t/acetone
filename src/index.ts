import 'dotenv/config';
import { Client, GatewayIntentBits, Message, PartialUser, Partials, User } from "discord.js";
import { testEmoji } from './image.js';

export const TOLERANCE = 0.005; //0.50%
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

    if (testRegex.test(content)) {  //Emoji
        const emoji = Array.from(content.matchAll(extractRegex), m => m[1]);    //Extract the ids of all emoji in the message

        for (const entry of emoji) {
            const test = await testEmoji(entry, TOLERANCE);
            if (test.result) {
                await moderateEmoji(message, test.bestMatch?.name ?? 'nail care');
                return;
            }
        }
    }

    async function moderateEmoji(message: Message, matchedEmojiName: string) {
        console.log(`Removing message from ${message.author.displayName}:\n\t${message.content} matches ${matchedEmojiName}`);

        await message.delete(); //Delete cringe message
        await message.author.send(`### Nail polish emoji detected, message removed:\n > ${message.content}`);   // Send a DM to the cringe user
    }
});

//Remove forbidden emoji
client.on('messageReactionAdd', async (react, user) => {
    const id = react.emoji.id;
    const name = react.emoji.name ?? '';

    if (id) {   //Custom emoji
        const test = await testEmoji(id, TOLERANCE)

        if (test.result) removeReaction(id, user, test.bestMatch?.name ?? 'nail care');

    } else if (emojiRegex.test(name)) {    //Unicode emoji
        removeReaction(name, user, 'nail care');

    }

    function removeReaction(emoji: string, user: User | PartialUser, matchedEmojiName: string) {
        console.log(`Removing reaction added by ${user.displayName}:\n\t${emoji} matches ${matchedEmojiName}`);

        const reactions = react.message.reactions.cache.get(emoji);
        if (!reactions) return;

        reactions.remove();
    }
});
