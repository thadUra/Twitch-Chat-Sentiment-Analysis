/* Init depdencies */
const dotenv = require("dotenv").config();
const language = require('@google-cloud/language');

/* Init google client for API access */
const client = new language.LanguageServiceClient(
    options = {
        projectId: process.env.GOOGLE_ID,
    }
);

/* Get sentiment from API */
async function sentiment(msg) {
    const document = {
        type: 'PLAIN_TEXT',
        content: msg
    };
    try {
        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;
        return sentiment;
    } catch(err) {
        console.log(`Err with google API: ${err}`);
        return -1;
    }
}

module.exports.sentiment = sentiment;