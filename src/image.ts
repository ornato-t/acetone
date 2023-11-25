import jimp from "jimp";
import sharp from 'sharp';

const SOURCE_URL = 'https://cdn.discordapp.com/emojis/1178086838561407148.webp?size=96';
const SOURCE_IMAGE = await read(SOURCE_URL);

export async function compareImage(imageUrl: string) {
    const jimage1 = SOURCE_IMAGE;
    const jimage2 = await read(imageUrl);

    const diff = jimp.diff(jimage1, jimage2, .1);

    return diff.percent;
}

/*
    Processes an image and brings it in the Jimp format
    1. Fetches the image
    2. Extracts it
    3. Converts it to PNG through Sharp (so Jimp can digest it)
    4. Converts it to a Jimp image
    5. Passes it through a grayscale 
*/
async function read(url: string) {
    const res = await fetch(url);
    const bufferWebp = await res.arrayBuffer();
    const bufferPng = await sharp(bufferWebp).toFormat('png').toBuffer();
    const jimpImage = await jimp.read(bufferPng);
    return jimpImage.greyscale();
}