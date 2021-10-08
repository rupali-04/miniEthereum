const Trie = require('./trie');

describe('Trie',()=>{
    let trie;
    beforeEach(()=>{
        trie = new Trie();
    });

    it('Has a RootHash',()=>{
        expect(trie.rootHash).not.toBe(undefined);
    });

    describe('put() function',()=>{
        it('It stores a value and key Pair',()=>{
            const key = 'foo';
            const value = 'bar';
            trie.put({key,value});

            expect(trie.get({key})).toEqual(value);
        });

        it('It Generate a new Root Hash after a key value pair is added!!',()=>{
            const originalRootHash = trie.rootHash;
            const key = 'foo';
            const value = 'bar';
            trie.put({key,value});
            const modifiedRootHash = trie.rootHash;
            expect(modifiedRootHash).not.toEqual(originalRootHash);
        });
    })
})