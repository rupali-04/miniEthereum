const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({block,transactionQueue}){

        return new Promise((resolve,reject)=>{
            Block.validateBlock({lastBlock: this.chain[this.chain.length - 1], block}).then(()=>{
                this.chain.push(block);
                
                transactionQueue.clearBlockTransaction({transactionSeries: block.transactionSeries});
                
                
                return resolve();
            }).catch(err=>{
                return reject(err);
            })
        });
      //  this.chain.push(block);
    }

    replaceChain({chain}){
        return new Promise(async (resolve,reject)=>{
            for(let i = 0;i<chain.length;i++){
                const block = chain[i];
                const index = i-1;
                const lastBlock = index>=0 ? chain[i - 1] : null;
                try{
                    await Block.validateBlock({lastBlock, block});
                }catch(err){
                    return reject(err);
                }
                
            }
            this.chain = chain;

            return resolve();
        })
    }
}


module.exports = Blockchain;


// const blockchain = new Blockchain();

// for(let i=0;i<10;i++){
//     const lastBlock = blockchain.chain[blockchain.chain.length-1];
//     const block = Block.mineBlock({
//         lastBlock,
//         beneficiary: "demo"
//     });

//     blockchain.addBlock({block});
//     console.log('Block:',block);
// }

