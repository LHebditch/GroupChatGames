const { handler } = require('./index');

const main = async () => {
    process.env.BUCKET_NAME = 'group-chat-games-word-store';
    try {
        const res = await handler();
        console.log(res)
    } catch (err) {
        console.error(err)
    }
}

main();