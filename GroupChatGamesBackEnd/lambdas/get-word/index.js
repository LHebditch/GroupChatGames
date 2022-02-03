const AWS = require('aws-sdk');

const SSM = new AWS.SSM({ region: 'eu-west-1' });

exports.handler = async (event) => {
    const { Parameter: { Value } } = await SSM.getParameter({
        Name: process.env.PARAM_NAME,
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ word: Value }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "GET"
        }
    }
}
