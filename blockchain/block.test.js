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

    describe('validateBlock()',()=>{
        let block,lastBlock;

        beforeEach(()=>{
            lastBlock = Block.genesis();
            block = Block.mineBlock({lastBlock,beneficiary: 'demo'});
        });
        it('When the Block is genesis Block it must be resolve',()=>{
            expect(Block.validateBlock({block: Block.genesis()})).resolves;
        });
        it('When the block is valid it must resolve!',()=>{
            expect(Block.validateBlock({lastBlock,block})).resolves;
        });

        it('When parentHash is Invalid Reject the block',()=>{
            block.blockHeaders.parentHash = 'wrong';

            expect(Block.validateBlock({lastBlock,block})).rejects.toMatchObject({message: `ParentHash of Block must be equal to lastBlock Hash!!`});
        });
        it('When number is not increased by 1 Reject the block',()=>{
            block.blockHeaders.number = lastBlock.blockHeaders.number + 3;

            expect(Block.validateBlock({lastBlock,block})).rejects.toMatchObject({message: `Number must increment be one!!`});
        });
        it('When difficulty is not adjust by 1 Reject the block',()=>{
            block.blockHeaders.difficulty = lastBlock.blockHeaders.difficulty + 3;

            expect(Block.validateBlock({lastBlock,block})).rejects.toMatchObject({message: `Difficulty must be adjust by 1!!`});
        });
        it('When Proof of work requirement is not met Promise is Rejected!!',()=>{
            const originalMethod = Block.calculateBlockTargetHash;
            Block.calculateBlockTargetHash = () => {
                return '0'.repeat(64);
            }
            expect(Block.validateBlock({lastBlock,block})).rejects.toMatchObject({message: 'Invalid Hash!!'});
            Block.calculateBlockTargetHash = originalMethod;
        });
    })
})