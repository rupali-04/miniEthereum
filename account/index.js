const {ec,keccakHash} = require('../util');
const {STARTING_BALANCE} = require('../config');

class Account{
    constructor(){
        this.keyPair = ec.genKeyPair(); // returns an obj with public and private key.
        this.address = this.keyPair.getPublic().encode('hex'); // this will get access to public key
        this.balance = STARTING_BALANCE;
    }
    sign(data){
        return this.keyPair.sign(keccakHash(data));
    }

    static verifySignature({publicKey,data,signature}){
        const keyFromPublic = ec.keyFromPublic(publicKey,'hex');

        return keyFromPublic.verify(keccakHash(data),signature);
    }
}

module.exports = Account;

// Two types of Accounts : 
//   1. Regural Account 
//   2. Smart Contract Account to Run code...