const dotenv = require("dotenv").config();
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient(
    options = {
        projectId: process.env.GOOGLE_ID
    }
);

async function sentiment(msg) {
    const document = {
        type: 'PLAIN_TEXT',
        content: msg
    };
    const [result] = await client.analyzeSentiment({document});
    const sentiment = result.documentSentiment;
    console.log(`Score: ${sentiment.score}, Mag: ${sentiment.magnitude}  => chat: ${msg}`);
}

module.exports.sentiment = sentiment;