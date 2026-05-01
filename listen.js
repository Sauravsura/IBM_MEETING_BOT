require('dotenv').config();
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const mic = require('mic');
const { saveNote } = require('./db');

// This specific initialization handles the "not a constructor" error
const stt = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ 
        apikey: process.env.STT_API_KEY 
    }),
    serviceUrl: process.env.STT_URL,
});

// ... (keep the rest of the file the same)

const micInstance = mic({ rate: '16000', channels: '1' });
const recognizeStream = stt.recognizeUsingWebSocket({
    contentType: 'audio/l16; rate=16000',
    objectMode: true,
    interimResults: true,
    keywords: ['deadline', 'task', 'important'],
    keywordsThreshold: 0.5,
    inactivityTimeout: -1, // Don't timeout on silence
});

micInstance.getAudioStream().pipe(recognizeStream);

recognizeStream.on('data', (data) => {
    const result = data.results[0];
    if (result && result.final) {
        const text = result.alternatives[0].transcript;
        console.log("🗣️ I heard:", text);
        if (text.includes('deadline') || text.includes('task') || text.includes('important')) {
            saveNote(text);
        }
    }
});

recognizeStream.on('error', (err) => {
    console.log("❌ IBM Stream Error:", err.message);
});

console.log("🚀 Listening... say something with 'task' or 'deadline'");
micInstance.start();