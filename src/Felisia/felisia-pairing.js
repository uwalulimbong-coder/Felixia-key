class FelisiaPairing {
    static async request(phoneNumber, retry = 5) {
        for (let i = 0; i < retry; i++) {
            try {
                const { state, saveCreds } = await useMultiFileAuthState(`./pairing/${phoneNumber}`);
                const tempSock = makeWASocket({
                    auth: state,
                    browser: ['𝐅𝐄𝐋𝐈𝐂𝐈𝐀', 'Chrome', '2.0.0'],
                    logger: P({ level: 'silent' }),
                    printQRInTerminal: false
                });

                if (!tempSock.authState.creds.registered) {
                    const code = await tempSock.requestPairingCode(phoneNumber);
                    return {
                        success: true,
                        code: code?.match(/.{1,4}/g)?.join("-") || code,
                        sock: tempSock,
                        saveCreds
                    };
                }
                return { success: true, alreadyRegistered: true, sock: tempSock, saveCreds };
            } catch(e) {
                if (i === retry - 1) return { success: false, error: e.message };
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
}

module.exports = FelisiaPairing;
