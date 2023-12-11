export const emojiList = [
    {
        name: 'nail care',
        path: getEmojiUrl('1178086838561407148'),
    },
    {
        name: 'baddie nails',
        path: getEmojiUrl('1178489718447550494'),
    },
    {
        name: 'blurred nail care',
        path: getEmojiUrl('1180961946950975592'),
    },
    {
        name: 'purple nails',
        path: 'https://cdn.discordapp.com/attachments/826405737093136437/1180891781173346344/Nail_Polish_Emoji_Icon_ios10_grande.png',
    }
] satisfies Emoji[];

export interface Emoji {
    name: string,
    path: string,
}

export function getEmojiUrl(id: string) {
    return `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
}
