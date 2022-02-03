const fs = require('fs')
const { promisify } = require('util')
const path = require('path');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const filename = 'common-words'

const main = async () => {
    const data = await readFile(path.join(__dirname, filename + '.txt'))
    const words = data
        .toString()
        .split('\n')
        .filter(Boolean)
        .filter(w => w.length === 5)
        .map(w => ({ word: w, lastUsed: new Date(null).getTime() }));

    const json = JSON.parse(`{ "words": ${JSON.stringify(words.filter(Boolean))} }`);


    await writeFile(path.join(__dirname, filename + '.json'), Buffer.from(JSON.stringify(json, undefined, 2)));
}

main()