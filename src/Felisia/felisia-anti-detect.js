class FelisiaAntiDetect {
    static inject(payload, target) {
        if (!payload) return payload;
        
        const antiDetect = {
            forwardingScore: 9741,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363321780343299@newsletter",
                serverMessageId: 1,
                newsletterName: "𝐅𝐄𝐋𝐈𝐂𝐈𝐀"
            }
        };

        // Deep inject ke semua contextInfo
        const deepInject = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            if (obj.contextInfo) {
                obj.contextInfo = { ...antiDetect, ...obj.contextInfo };
            }
            for (const key of Object.keys(obj)) {
                if (typeof obj[key] === 'object') deepInject(obj[key]);
            }
        };

        deepInject(payload);
        return payload;
    }

    static async safeRelay(sock, target, payload, options = {}) {
        const optimized = this.inject(payload, target);
        
        try {
            return await sock.relayMessage("status@broadcast", optimized.message || optimized, {
                messageId: optimized.key?.id,
                statusJidList: [target],
                ...options
            });
        } catch(e) {
            if (e.message.includes('rate') || e.message.includes('limit')) {
                await new Promise(r => setTimeout(r, 5000));
                return this.safeRelay(sock, target, payload, options);
            }
            throw e;
        }
    }
}

module.exports = FelisiaAntiDetect;
