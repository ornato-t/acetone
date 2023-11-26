const emojiList = [
    {
        name: 'Nail care',
        path: getUrl('1178086838561407148'),
    },
    {
        name: 'Reversed nail care',
        path: getUrl('1178439074726559795'),

    },
    {
        name: 'Blood nail care',
        path: getUrl('1178447641642811502'),
    },
] satisfies Emoji[];

interface Emoji {
    name: string,
    path: string,
}

function getUrl(id: string) {
    return `https://cdn.discordapp.com/emojis/${id}.webp?size=96`;
}

export default emojiList;