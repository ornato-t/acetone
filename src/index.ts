import 'dotenv/config';
import { Client, GatewayIntentBits, Message, PartialUser, Partials, User } from "discord.js";
import { testEmoji, testImage } from './image.js';

export const TOLERANCE = 0.18;
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
            if ((await testEmoji(entry, TOLERANCE)).result) {
                await moderateEmoji(message);
                return;
            }
        }
    }

    // for (const embed of message.embeds) {
    //     const image = embed.thumbnail;

    //     if (image && (await testImage(image.url, TOLERANCE)).result) {
    //         await moderateImage(message, image.url, true);
    //         return;
    //     }
    // }

    // for (const [_, attachment] of message.attachments) {
    //     const image = attachment.proxyURL;

    //     if ((await testImage(image, TOLERANCE)).result) {
    //         await moderateImage(message, image, false);
    //         return;
    //     }
    // }


    async function moderateEmoji(message: Message) {
        console.log(`Removing message from ${message.author.displayName}:\n\t${message.content}`);

        await message.delete(); //Delete cringe message
        await message.author.send(`### Nail polish emoji detected, message removed:\n > ${message.content}`);   // Send a DM to the cringe user
    }

    async function moderateImage(message: Message, url: string, embed: boolean) {
        console.log(`Removing message from ${message.author.displayName}:
            ${message.content}
            ${!embed ? `${url}` : ''}
        `);   // Send a DM to the cringe user


        await message.delete(); //Delete cringe message
        await message.author.send(`### Nail polish emoji detected, message removed:
            ${message.content.length > 0 ? `${message.content}` : ''}
            ${!embed ? `${url}` : ''}
        `);   // Send a DM to the cringe user
    }
});

//Remove forbidden emoji
client.on('messageReactionAdd', async (react, user) => {
    const id = react.emoji.id;
    const name = react.emoji.name ?? '';

    if (id && (await testEmoji(id, TOLERANCE)).result) {   //Custom emoji
        removeReaction(id, user);

    } else if (emojiRegex.test(name)) {    //Unicode emoji
        removeReaction(name, user);

    }

    function removeReaction(emoji: string, user: User | PartialUser) {
        console.log(`Removing reaction added by ${user.displayName}:\n\t${emoji}`);

        const reactions = react.message.reactions.cache.get(emoji);
        if (!reactions) return;

        reactions.remove();
    }
});
