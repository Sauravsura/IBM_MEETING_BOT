require('dotenv').config();
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const { getLatestNotes } = require('./db');

const tts = new TextToSpeechV1({
    authenticator: new IamAuthenticator({ 
        apikey: process.env.TTS_API_KEY 
    }),
    serviceUrl: process.env.TTS_URL,
});

// ... (keep the rest of the file the same)

async function speak() {
    const text = await getLatestNotes();
    console.log("📖 Summarizing:", text);
    const response = await tts.synthesize({ text: text, accept: 'audio/wav', voice: 'en-US_AllisonV3Voice' });
    const buffer = await tts.repairWavHeaderStream(response.result);
    fs.writeFileSync('summary.wav', buffer);
    console.log("✅ Created summary.wav! Play this file now.");
}

speak();