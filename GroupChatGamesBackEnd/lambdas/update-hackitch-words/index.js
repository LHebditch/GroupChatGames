const AWS = require('aws-sdk')

const S3 = new AWS.S3({ region: 'eu-west-1' });
const SSM = new AWS.SSM({ region: 'eu-west-1' });

const getClutterWord = (wordlist, word, clutter) => {
    const likeness = Math.round(Math.random() * 3) // likeness between 0 and 3;
    const indexesToMatch = []

    for (let i = 0; i < likeness; i++) {
        const index = getIndex(indexesToMatch, word.length - 1)
        indexesToMatch.push(index)
    }

    const clutterWord = wordlist.filter(({ word: w }) => {
        for (let i = 0; i < indexesToMatch.length; i++) {
            if (w[indexesToMatch[i]] != word[indexesToMatch[i]]) {
                return false;
            }
        }
        return true;
    })[0];

    if (clutterWord != word) {
        return clutterWord || getClutterWord(wordlist, word, clutter);
    }

    return getClutterWord(wordlist, word, clutter);
}

const getIndex = (usedIndexes, maxIndex) => {
    const index = Math.round(Math.random() * maxIndex);
    if (usedIndexes.includes(index)) {
        return getIndex(usedIndexes, maxIndex)
    }
    return index
}

exports.handler = async (event) => {
    // get list of words,
    // find a new one that's not been used for a while
    // update param store
    const { Body } = await S3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: 'hackitch/4_letter_words.json'
    }).promise();

    // parse into an array of words
    const { words: wordlist } = JSON.parse(Body.toString());
    const lastYear = new Date().setMonth(new Date().getMonth() - 12);
    const validWords = wordlist.filter(w => w.lastUsed < lastYear);
    let shuffledWords = validWords.sort((a, b) => Math.random() - Math.random());
    const { word } = shuffledWords[0];
    shuffledWords = shuffledWords.filter(w => w.word != word);
    const clutter = []
    for (let i = 0; i < 10; i++) {
        const { word: clutterWord } = getClutterWord(shuffledWords, word, clutter)
        clutter.push(clutterWord);
        shuffledWords = shuffledWords.filter(w => w.word != clutterWord)
    }

    await SSM.putParameter({
        Name: process.env.PARAM_NAME,
        Value: JSON.stringify({ solution: word, clutter }),
        Overwrite: true
    }).promise()

    wordlist.filter(w => w.word === word).forEach(w => w.lastUsed = new Date().getTime());

    await S3.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: 'hackitch/4_letter_words.json',
        Body: JSON.stringify({ words: wordlist })
    }).promise();
}