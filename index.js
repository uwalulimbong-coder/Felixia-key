const FelisiaCore = require('./Felisia/felisia-core');
const FelisiaAntiDetect = require('./Felisia/felisia-anti-detect');
const FelisiaSender = require('./Felisia/felisia-sender');
const FelisiaPairing = require('./Felisia/felisia-pairing');
const FelisiaRecovery = require('./Felisia/felisia-recovery');

module.exports = {
    FelisiaCore,
    FelisiaAntiDetect,
    FelisiaSender,
    FelisiaPairing,
    FelisiaRecovery,
    
    // Quick start
    create: async (sessionDir) => {
        const core = new FelisiaCore();
        const sock = await core.connect(sessionDir);
        FelisiaRecovery.attach(sock, () => core.connect(sessionDir));
        return { sock, core };
    }
};
