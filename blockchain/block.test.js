const { keccakHash } = require('../util');
const Block = require('./block');

describe('Block',()=>{
    describe('CalculateBlockTargetHash()',()=>{
        it('When LastBlock difficulty is 1 Max Hash is returned',()=>{
            expect(Block.calculateBlockTargetHash({lastBlock: {blockHeaders: {difficulty: 1}}})).toEqual('f'.repeat(64));
        });
        it('When LastBlock difficulty is High and then it returns a low value',()=>{
            expect(Block.calculateBlockTargetHash({lastBlock: {blockHeaders: {difficulty: 500}}}) < '1').toBe(true);
        })
    });
    describe('mineBlock()',()=>{
        let lastBlock,minedBlock;

        beforeEach(()=>{
            lastBlock = Block.genesis();
            minedBlock = Block.mineBlock({lastBlock,beneficiary: 'demo'});
        });

        it('it mines a Block',()=>{
            expect(minedBlock).toBeInstanceOf(Block);
        });

        it('Proof of work requirements is meet before minning!!',()=>{
            const target = Block.calculateBlockTargetHash({lastBlock});
            const {blockHeaders} = minedBlock;
            const {nonce} = blockHeaders;
            const tBlock = {...blockHeaders};
            delete tBlock.nonce;
            const header = keccakHash(tBlock);
            const underTargetHash = keccakHash(header+nonce);

            expect(underTargetHash < target).toBe(true);
        });
    });

    describe('adjustDifficulty()',()=>{
        it('keeps the difficulty above 0',()=>{
            expect(Block.adjustDifficulty({lastBlock: {blockHeaders: {difficulty:0}},timestamp: Date.now()})).toEqual(1);
        });
        it('When time to mine a block decreases difficulty increases',()=>{
            expect(Block.adjustDifficulty({
                lastBlock: {blockHeaders: {difficulty: 5,timestamp:1000}},
                timestamp: 3000
            })).toEqual(6);
        });

        it('When time to mine a block increases difficulty decreases',()=>{
            expect(Block.adjustDifficulty({
                lastBlock: {blockHeaders: {difficulty: 5,timestamp:1000}},
                timestamp: 30000
            })).toEqual(4);
        });
    });
})