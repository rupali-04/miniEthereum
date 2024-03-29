const { v4: uuidv4 } = require('uuid');
const Account = require('../account');

const TRANSACTION_TYPE_MAP = {
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    TRANSACT: 'TRANSACT'
}

class Transaction {
    constructor({id,from,to,value,data,signature}){
        this.id = id || uuidv4();
        this.from = from || '-';
        this.to = to || '-';
        this.value = value || 0;
        this.data = data || '-';
        this.signature = signature || '-';
    }
    static createTransaction({account,to,value}){
        if(to){
            const transactionData = {
                id: uuidv4(),
                from: account.address,
                to,
                value,
                data: {type: TRANSACTION_TYPE_MAP.TRANSACT}
            };
            return new Transaction({...transactionData,signature: account.sign(transactionData)})
        };

        return new Transaction({data: {type: TRANSACTION_TYPE_MAP.CREATE_ACCOUNT,accountData: account.toJSON()}});
    }

    static validateStandardTransaction({transaction}){
        return new Promise((resolve,reject)=>{
            const {from,signature} = transaction;
            const transactionData = {...transaction};
            delete transactionData.signature;

            if(!Account.verifySignature({publicKey: from,data: transactionData,signature }))
            {
                    return reject(new Error(`Transaction ${id} signature is invalid!!`));
            }
                return resolve();

            });
    }
    static validateCreateAccountTransaction({transaction}){
        return new Promise((resolve,reject) => {
            const expectedAccountDataFields = Object.keys(new Account().toJSON());
            const fields = Object.keys(transaction.data.accountData) ;
            
            if(fields.length !== expectedAccountDataFields.length){
                return reject(
                    new Error('The transaction account data has an incorrect number of fields')
                );
            }
            fields.forEach(field =>{
               if(!expectedAccountDataFields.includes(field)){
                   return reject(new Error(`The field: ${field}, is incorrect for account data`))
               } 
            });
            return resolve();
        });
    }
    static runTransaction({transaction,state}){
        switch(transaction.data.type){
            case TRANSACTION_TYPE_MAP.TRANSACT:
                Transaction.runStandardTransaction({state,transaction});
                console.log('--Updated account Data for Standard Transaction!!--');
                break;
            case TRANSACTION_TYPE_MAP.CREATE_ACCOUNT:
                Transaction.runCreateAccountTransaction({state,transaction});
                console.log('--Store Account Data!!--');
                break;
            default:
                break;
        }
    }
    static runStandardTransaction({state,transaction}){
        const fromAccount = state.getAccount({address: transaction.from});
        const toAccount = state.getAccount({address: transaction.to});

        const {value} = transaction;
        fromAccount.balance -= value;
        toAccount.balance +=value;

        state.putAccount({address: transaction.from,accountData: fromAccount});
        state.putAccount({address: transaction.to,accountData: toAccount});
    }

    static runCreateAccountTransaction({state,transaction}){
        const {accountData} = transaction.Data;
        const {address} = accountData;

        state.putAccount({address,accountData});
    }
}

module.exports = Transaction;
