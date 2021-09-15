const express = require('express');
const request = require('request');
const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

app.get('/blockchain',(req,res,next) => {
    const {chain} = blockchain;
    res.json({chain});
});

app.get('/blockchain/mine',(req,res,next)=>{
    const lastBlock = blockchain.chain[blockchain.chain.length -1];
    const block = Block.mineBlock({lastBlock});
   // block.blockHeaders.parentHash = 'demo';
    blockchain.addBlock({block}).then(()=>{
        pubsub.broadcastBlock(block);
        return res.json({block});
    }).catch(err => next(err));
});

// Error Handling middleLayer
app.use((err,req,res,next) => {
    console.error('Internal Server Error!!');
    res.status(500).json({message: err.message});
})

// To run peers of blockchain which can mine block we need to set random port to them....
// Default port for Root application should be set to 3000
const peer = process.argv.includes('--peer');
const PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3000;

if(peer){
    // request the blockchain from root
    request('http://localhost:3000/blockchain', async(error,response,body)=>{
        // body object has the chain array but request has stringify it so we need to parse it to convert it into object
        const {chain} = JSON.parse(body);
        try {
            await blockchain.replaceChain({chain});  
            console.log(('Synchronized Blockchain with the root node!!'));  
        } catch (error) {
            console.error('Syncronization Error:',error.message);
        }
        
        // blockchain.replaceChain({chain}).then(()=>{
        //     console.log(('Synchronized Blockchain with the root node!!'));  
        // }).catch(err => console.error('Syncronization Error:',err.message))
    });
}

app.listen(PORT,()=>{
    return console.log(`Server is Running up at port: ${PORT}!!`);
});


