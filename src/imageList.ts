export const emojiList = [
    {
        name: 'nail care',
        path: getEmojiUrl('1178086838561407148'),
    },
    {
        name: 'blood nail care',
        path: getEmojiUrl('1178447641642811502'),
    },
    {
        name: 'baddie nails',
        path: getEmojiUrl('1178489718447550494'),
    },
    {
        name: 'emboss care',
        path: getEmojiUrl('1180048622927228928'),
    }
] satisfies Emoji[];

export interface Emoji {
    name: string,
    path: string,
}

export function getEmojiUrl(id: string) {
    return `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
}
