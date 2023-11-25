import { compareImage } from './image';

const list = await getEmojiList();
for (const emoji of list) {
    console.log(await isTarget(emoji.path, 0.15), '\t', emoji.name);
}

async function getEmojiList() {
    const res = await fetch("https://discord.com/api/guilds/SERVER_ID/emojis?limit=1000", {
        headers: {
            Authorization: "Bot TOKEN",
        }
    });

    const json = await res.json() as { id: string, name: string }[];

    return json.map(emoji => ({ name: emoji.name, path: emoji.id }))
}


async function isTarget(id: string, tolerance: number) {
    const url = `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
    const match = await compareImage(url);

    return match <= tolerance;
}