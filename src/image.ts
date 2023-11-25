import Jimp from "jimp";

const SOURCE_URL = 'https://cdn.discordapp.com/emojis/1178086838561407148.webp?size=96';
const SOURCE_IMAGE =await Jimp.read(SOURCE_URL);

export async function compareImage(imageUrl: string) {
    const jimage1 = SOURCE_IMAGE;
    const jimage2 = await Jimp.read(imageUrl);

    const diff = Jimp.diff(jimage1, jimage2, .1);

    return diff.percent;
}