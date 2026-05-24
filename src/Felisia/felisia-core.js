const { default: makeWASocket, useMultiFileAuthState, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const P = require('pino');

class FelisiaCore {
    constructor(options = {}) {
        this.sock = null;
        this.connected = false;
        this.version = '2.0.0 PREMIUM';
        this.browser = options.browser || ['𝐅𝐄𝐋𝐈𝐂𝐈𝐀', 'Chrome', '2.0.0'];
    }

    async connect(sessionDir = './felisia-session') {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        this.sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: P({ level: 'silent' }),
            browser: this.browser,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            retryRequestDelayMs: 1000,
            maxMsgRetryCount: 5
        });

        this.sock.ev.on('connection.update', (update) => {
            const { connection } = update;
            this.connected = connection === 'open';
            if (this.connected) console.log('✅ 𝐅𝐄𝐋𝐈𝐂𝐈𝐀 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃!');
        });

        this.sock.ev.on('creds.update', saveCreds);
        
        await this.waitForConnection();
        return this.sock;
    }

    waitForConnection(timeout = 60000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout')), timeout);
            const check = setInterval(() => {
                if (this.connected) { clearTimeout(timer); clearInterval(check); resolve(); }
            }, 500);
        });
    }
}

module.exports = FelisiaCore;
