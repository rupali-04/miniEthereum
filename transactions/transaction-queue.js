// This is a data structure to store transactions....

/// There will be the queue of transaction object...

class TransactionQueue{
    constructor(){
        this.transactionMap = {};
    }

    add(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    getTransactionPool(){
       return Object.values(this.transactionMap)
    };

    clearBlockTransaction({transactionSeries}){
        for(let transaction of transactionSeries){
            delete this.transactionMap[transaction.id];
        }
    }
}

module.exports = TransactionQueue;