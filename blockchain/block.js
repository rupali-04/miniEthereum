const { keccakHash } = require('../util');
const {GENESIS_DATA,MINE_RATE} = require('../config');

const HASH_LENGTH =64;
const MAX_LENGTH_VALUE = parseInt('f'.repeat(HASH_LENGTH),16);
const MAX_NOUNCE_VALUE = 2 ** 64;

class Block {
    constructor({blockHeaders}){
        this.blockHeaders = blockHeaders;
    }
    static calculateBlockTargetHash({lastBlock}){
        const value = (MAX_LENGTH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);
        if(value.length > HASH_LENGTH){
            return 'f'.repeat(HASH_LENGTH);
        }
        return '0'.repeat(HASH_LENGTH - value.length) + value;
    }

    static adjustDifficulty({lastBlock,timestamp}) {
        const {difficulty} = lastBlock.blockHeaders;
        if((timestamp - lastBlock.blockHeaders.timestamp) > MINE_RATE){
            return difficulty - 1;
        }

        if(difficulty < 1){
            return 1;
        }

        return difficulty + 1;
    }

    static mineBlock({lastBlock,beneficiary}){
        const target = Block.calculateBlockTargetHash({lastBlock});
        let timestamp,turncatedBlockHeaders, header, nonce,underTargetHash;
        do{
            
            timestamp = Date.now();
            turncatedBlockHeaders = {
                parentHash: keccakHash(lastBlock.blockHeaders),
                timestamp,
                beneficiary,
                difficulty: Block.adjustDifficulty({lastBlock,timestamp}),
                number: lastBlock.blockHeaders.number + 1
            };
            header = keccakHash(turncatedBlockHeaders);
            nonce = Math.floor(Math.random() * MAX_NOUNCE_VALUE);
            underTargetHash = keccakHash(header + nonce);
        }while(underTargetHash > target);

        
            return new Block({blockHeaders: {...turncatedBlockHeaders,nonce}});
        
    }

    static genesis() {
        // this keyword is same as class name;
        return new Block(GENESIS_DATA);
    }
}

module.exports = Block;

// const b = Block.mineBlock({lastBlock: Block.genesis(),beneficiary: "demo"});

// console.log(b);
