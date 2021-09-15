const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-60ca14b5-697b-4a70-8a36-e7e2e2c3b2bb',
    subscribeKey: 'sub-c-5b2bdb5a-1586-11ec-abb2-e20c06117408',
    secretKey: 'sec-c-NjRkMDczZWMtOTdjNC00M2M0LWIxMmYtNjczNTAyOTc5MDg3'
}

const CHANNELS_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK'
}

class PubSub {
    constructor({blockchain}){
        this.pubnub = new PubNub(credentials);
        this.blockchain = blockchain;
        this.subscribeToChannels();
        this.listen();
    }

    subscribeToChannels(){
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        });
    }

    publish({channel,message}){
        this.pubnub.publish({channel,message});
    }

    listen() {
        this.pubnub.addListener({
            message: messageObject => {
                const {channel,message} = messageObject;
                const parseMsg = JSON.parse(message);
                
                console.log(`Message was Recevied. Channel: ${channel}`);

                switch(channel) {
                    case CHANNELS_MAP.BLOCK: 
                        console.log('Block Message:',message);
                        this.blockchain.addBlock({block: parseMsg}).then(()=>{
                            console.log(`New Block is Accepted!!`);
                        }).catch(err => console.error(`New Block Rejected: ${err.message}`));
                    break;
                    default: 
                        return;
                }
                
            }
        });
    }

    broadcastBlock(block){
        this.publish({
            channel: CHANNELS_MAP.BLOCK,
            message: JSON.stringify(block)
        });
    }

}


module.exports = PubSub;

// Debugging code....


// const pubsub = new PubSub();
// setTimeout(()=>{

    
// pubsub.publish({
//     channel: CHANNELS_MAP.TEST,
//     message: 'demo' 
// });

// },3000);