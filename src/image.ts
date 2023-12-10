import jimp from "jimp";
import sharp from 'sharp';
import { emojiList, Emoji, getEmojiUrl } from './imageList.js';
import { whitelist } from './whitelist.js';

const IMAGES = new Array<EmojiImage>;
for (const image of emojiList) {
    const res = await read(image.path);
    IMAGES.push({ jimp: res, name: image.name, path: image.path, match: 999 });
}

// Returns `true` if the emoji with the provided `id` matches the target below a `tolerance`, false otherwise
export async function testEmoji(id: string, tolerance: number) {
    if (whitelist.includes(id)) return { result: false, bestMatch: null };
    const jTargetImage = await read(getEmojiUrl(id));

    let bestMatch: EmojiImage = IMAGES[0];
    for (const image of IMAGES) {
        const match = test(image.jimp, jTargetImage);

        if (match < bestMatch.match) bestMatch = { ...image, match };

        if (match <= tolerance) return { result: true, bestMatch };
    }

    return { result: false, bestMatch };
}

// Returns `true` if the image with the provided `url` matches the target below a `tolerance`, false otherwise
export async function testImage(url: string, tolerance: number) {
    const jTargetImage = await read(url);

    let bestMatch: EmojiImage = IMAGES[0];
    for (const image of IMAGES) {
        const match = test(image.jimp, jTargetImage);

        if (match < bestMatch.match) bestMatch = { ...image, match };

        if (match <= tolerance) return { result: true, bestMatch };
    }

    return { result: false, bestMatch };
}

/**
 * Parses an image and its variations, and returns its closest difference
 * 1. Flips it horizzontally 
 * 2. Computes a difference, returns the smallest difference available 
 * 
 * @param image image in the jimp format
 */
function test(source: jimp, target: jimp) {
    const match = jimp.diff(source, target, .1).percent;

    target.mirror(true, false);
    const matchFlipped = jimp.diff(source, target, .1).percent;

    if (match < matchFlipped) return match;
    return matchFlipped;
}

/*
    Processes an image and brings it in the Jimp format
    1. Fetches the image
    2. Extracts it
    3. Converts it to PNG through Sharp (so Jimp can digest it)
    4. Converts it to a Jimp image
    5. Passes it through a greyscale
*/
async function read(url: string) {
    const res = await fetch(url);
    const bufferWebp = await res.arrayBuffer();
    const bufferPng = await sharp(bufferWebp).toFormat('png').toBuffer();
    const jimpImage = await jimp.read(bufferPng);
    return jimpImage.greyscale();   //TODO: instead of greyscale, mask
}

export interface EmojiImage extends Emoji {
    jimp: jimp;
    match: number;
}