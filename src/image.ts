import jimp from "jimp";
import sharp from 'sharp';
import imageList from './imageList.js';

const IMAGES = new Array<jimp>;
for (const image of imageList) {
    const res = await read(image.path);
    IMAGES.push(res);
}

// Returns `true` if the emoji with the provided `id` matches the target below a `tolerance`, false otherwise
export async function isTarget(id: string, tolerance: number) {
    const targetUrl = `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
    const jTargetImage = await read(targetUrl);

    for (const jImage of IMAGES) {
        const match = jimp.diff(jImage, jTargetImage, .1).percent;
        if (match <= tolerance) return true;
    }

    return false;
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