const AWS = require('aws-sdk')

const S3 = new AWS.S3({ region: 'eu-west-1' });
const SSM = new AWS.SSM({ region: 'eu-west-1' });

exports.handler = async (event) => {
    console.log('hi')
    // get list of words,
    // find a new one that's not been used for a while
    // update param store
    const { Body } = await S3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: 'word_list.json'
    }).promise();

    // parse into an array of words
    const { words: wordlist } = JSON.parse(Body.toString());
    const lastYear = new Date().setMonth(new Date().getMonth() - 12);
    const validWords = wordlist.filter(w => w.lastUsed < lastYear);
    const { word } = validWords.sort((a, b) => Math.random() - Math.random())[0];

    await SSM.putParameter({
        Name: process.env.PARAM_NAME,
        Value: word,
        Overwrite: true
    }).promise()

    wordlist.filter(w => w.word === word).forEach(w => w.lastUsed = new Date().getTime());

    await S3.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: 'word_list.json',
        Body: JSON.stringify({ words: wordlist })
    }).promise();
}
