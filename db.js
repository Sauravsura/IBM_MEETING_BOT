require('dotenv').config();
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-watson/auth');

const client = CloudantV1.newInstance({
    authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_API_KEY }),
    serviceUrl: process.env.CLOUDANT_URL,
});

async function saveNote(text) {
    const doc = { content: text, timestamp: new Date().toISOString() };
    await client.postDocument({ db: 'meeting_notes', document: doc });
    console.log("💾 Saved to Cloudant!");
}

async function getLatestNotes() {
    const response = await client.postAllDocs({ db: 'meeting_notes', includeDocs: true, limit: 5 });
    return response.result.rows.map(row => row.doc.content).join(". ");
}

module.exports = { saveNote, getLatestNotes };