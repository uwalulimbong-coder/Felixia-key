class FelisiaRecovery {
    static attach(sock, reconnectFn) {
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('❌ Logged Out — Need re-pairing');
                    return;
                }
                
                console.log('🔄 Auto Reconnecting in 3s...');
                await new Promise(r => setTimeout(r, 3000));
                
                try {
                    await reconnectFn();
                    console.log('✅ Reconnected!');
                } catch(e) {
                    console.log('❌ Reconnect failed, retrying...');
                    setTimeout(() => this.attach(sock, reconnectFn), 5000);
                }
            }
        });
    }
}

module.exports = FelisiaRecovery;
