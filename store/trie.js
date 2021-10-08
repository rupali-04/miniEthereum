const {keccakHash} = require('../util');

class Node{
    constructor(){
        this.value = null;
        this.childMap = {}
    }
}

class Trie{
    constructor(){
        this.head = new Node();
        this.generateRootHash();
    }

    // Create Root Hash
    generateRootHash(){
        this.rootHash = keccakHash(this.head);
    }

    // get method to retive value from key
    get({key}){
        // Refer a node to the head of the structure
        let node = this.head;

        // iterate to all the characters of the key to find the value
        for(let ch of key){
            if(node.childMap[ch]){
                node = node.childMap[ch];
            }
            else{
                return 
            }
        }
        return node.value;
    }

    // put method to store value with it's key
    put({key,value}){
        // Create an instance of node class
        let node = this.head;
        
        // Check wheather the key character already exsist in childMap or not
        // If the char is not present create an node with the character till 
        // If exsist proceed further till the end of the key and than store value.

        for(let ch of key){
            if(!node.childMap[ch]){
                node.childMap[ch] = new Node();
            }
            node = node.childMap[ch];
        }
        node.value = value;

        // Generate hash each time a new key value pair is added
        this.generateRootHash();
    }
}

module.exports = Trie;

// Testing Code

// let trie = new Trie();
// trie.put({key: "foo", value: "bar"});
// console.log('trie:',JSON.stringify(trie));
// const val = trie.get({key:'foo'});
// console.log(val);
// trie.put({key: "doo", value: "par"});
// console.log('trie:',JSON.stringify(trie));
// const val1 = trie.get({key:'doo'});
// console.log(val1);