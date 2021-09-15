const GENESIS_DATA = {
    blockHeaders: {
        parentHash: '--Genesis-Parent-Hash--',
        beneficiary: '--Genesis-Beneficiary--',
        difficulty: 10,
        number: 0,
        timestamp: '--Genesis-Timestamp--',
        nounce: 0
    }
};
const STARTING_BALANCE = 1000;
const MINE_RATE = 13 * (1000 * 1); 
module.exports = { GENESIS_DATA,MINE_RATE,STARTING_BALANCE };