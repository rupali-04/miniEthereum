const Block = require('./block');

describe('Block',()=>{
    describe('CalculateBlockTargetHash()',()=>{
        it('When LastBlock difficulty is 1 Max Hash is returned',()=>{
            expect(Block.calculateBlockTargetHash({lastBlock: {blockHeaders: {difficulty: 1}}})).toEqual('f'.repeat(64));
        });
        it('When LastBlock difficulty is High and then it returns a low value',()=>{
            expect(Block.calculateBlockTargetHash({lastBlock: {blockHeaders: {difficulty: 500}}}) < '1').toBe(true);
        })
    })
})