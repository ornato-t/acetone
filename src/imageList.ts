export const emojiList = [
    {
        name: 'Nail care',
        path: getEmojiUrl('1178086838561407148'),
    },
    {
        name: 'Blood nail care',
        path: getEmojiUrl('1178447641642811502'),
    },
    {
        name: 'Baddie nails',
        path: getEmojiUrl('1178489718447550494'),
    },
] satisfies Emoji[];

export interface Emoji {
    name: string,
    path: string,
}

export function getEmojiUrl(id: string) {
    return `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
}
