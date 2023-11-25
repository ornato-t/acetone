import pixelmatch from 'pixelmatch';
import sharp from 'sharp';

const SOURCE_URL = 'https://cdn.discordapp.com/emojis/1178086838561407148.webp';
const SOURCE_IMAGE = await readImage(SOURCE_URL);


async function readImage(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const image = sharp(Buffer.from(arrayBuffer));
    const res = await image.greyscale().raw().toBuffer();

    return new Uint8Array(res);
}

export async function compareImage(imageUrl: string) {
    const img1 = SOURCE_IMAGE;
    const img2 = await readImage(imageUrl);
    const diff = new Uint8Array(96 * 96 * 4); // RGBA

    const numDiffPixels = pixelmatch(
        img1, img2, diff,
        96, 96,
        { threshold: 0.1 }
    );

    return numDiffPixels;
}