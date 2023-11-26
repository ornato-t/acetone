const emojiList = [
    {
        name: 'Nail care',
        path: 'https://cdn.discordapp.com/emojis/1178086838561407148.webp?size=96'
    },
    {
        name: 'Reversed nail care',
        path: 'https://cdn.discordapp.com/emojis/1178439074726559795.webp?size=96'
    },
] satisfies Emoji[];

interface Emoji {
    name: string,
    path: string,
}

export default emojiList;