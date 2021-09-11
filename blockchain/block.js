const {GENESIS_DATA} = require('../config');
class Block {
    constructor({blockHeaders}){
        this.bockHeaders = blockHeaders;
    }

    static mineBlock({lastBlock}){
        
    }

    static genesis() {
        // this keyword is same as class name;
        return new this(GENESIS_DATA);
    }
}

module.exports = Block;