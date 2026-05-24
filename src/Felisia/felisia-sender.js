class FelisiaSender {
    static senders = new Map();
    static maxSenders = 10;

    static async add(phoneNumber) {
        if (this.senders.size >= this.maxSenders) {
            throw new Error('Max senders reached!');
        }
        
        const { state, saveCreds } = await useMultiFileAuthState(`./senders/${phoneNumber}`);
        const sock = makeWASocket({
            auth: state,
            browser: ['𝐅𝐄𝐋𝐈𝐂𝐈𝐀', 'Chrome', '2.0.0'],
            logger: P({ level: 'silent' })
        });
        
        this.senders.set(phoneNumber, { sock, saveCreds, active: true });
        return sock;
    }

    static remove(phoneNumber) {
        this.senders.delete(phoneNumber);
    }

    static getAll() {
        return Array.from(this.senders.entries());
    }

    static getActive() {
        return Array.from(this.senders.entries()).filter(([_, v]) => v.active);
    }
}

module.exports = FelisiaSender;
