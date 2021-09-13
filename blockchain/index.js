const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({block}){
        this.chain.push(block);
    }
}


module.exports = Blockchain;


const blockchain = new Blockchain();

for(let i=0;i<10;i++){
    const lastBlock = blockchain.chain[blockchain.chain.length-1];
    const block = Block.mineBlock({
        lastBlock,
        beneficiary: "demo"
    });

    blockchain.addBlock({block});
    console.log('Block:',block);
}

