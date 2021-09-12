const {GENESIS_DATA} = require('../config');

const HASH_LENGTH =64;

class Block {
    constructor({blockHeaders}){
        this.bockHeaders = blockHeaders;
    }
    static calculateBlockTargetHash({lastBlock}){

    }
    static mineBlock({lastBlock,beneficiary}){
        
    }

    static genesis() {
        // this keyword is same as class name;
        return new this(GENESIS_DATA);
    }
}

module.exports = Block;