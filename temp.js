const Trie = require('./store/trie');
const {keccakHash} = require('./util');

const trie = new Trie();
const accountData = {balance: 1000};
const transaction = {data: accountData};

trie.put({key: 'foo',value: transaction});
const retrivedTransaction = trie.get({key: 'foo'});
const hash1 = keccakHash(retrivedTransaction);
console.log('Hash1:',hash1);

// Update the accountData
accountData.balance += 50;

const hash2 = keccakHash(retrivedTransaction);
console.log('Hash2:',hash2);

// Expected Result Hash1 = Hash2
// Recived Result Hash1 != Hash2 (because we have used the reference of the object so the change at one place will refect in the entire code...)
// To solve the Expected Result (use Lodash package to return the clone of the value rather than returing the reference of the value)
