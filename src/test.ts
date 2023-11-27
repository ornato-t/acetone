import 'dotenv/config';
import { isTarget } from "./image.js";
import { TOLERANCE } from "./index.js";

await test('931407728000237588');
await testEmoji();

process.exit(0);

//Test an emoji, by its ID against the Acetone Detection Algorithm, prints the result
async function test(id: string) {
    const res = await isTarget(id, TOLERANCE);

    console.log(`Test: ${res.result}, closest match found: ${res.bestMatch.name} with a ${(res.bestMatch.match * 100).toFixed(2)}% match`);
}

//Test the entire emoji library against the Acetone Detection Algorithm, prints any positive matches
async function testEmoji() {
    const res = await fetch('https://discord.com/api/guilds/826405737093136434/emojis', {
        headers: new Headers({ Authorization: `Bot ${process.env.DISCORD_TOKEN}` })
    });
    const emojiList = await res.json() as { id: string, name: string }[];

    for(const emoji of emojiList) {
        const testResult = await isTarget(emoji.id, TOLERANCE);
        if(true || testResult.result) {
            console.warn(`Emoji ${emoji.name} matches: ${testResult.result}, closest match found: ${testResult.bestMatch.name} with a ${(testResult.bestMatch.match * 100).toFixed(2)}% match`);
        }
    }
}