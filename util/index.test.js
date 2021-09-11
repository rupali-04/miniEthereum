const { keccak256 } = require('js-sha3');
const {sortCharacters,keccakHash} = require('./index');

describe('util', ()=>{
    describe('sortCharactes()', () => {
        it('Different Order of same String gives same Output!!',()=>{
            expect(sortCharacters({demo: 'demo', Str: 'String'})).toEqual(sortCharacters({Str: 'String',demo: 'demo'}));
        });
        it('Different Output for different Strings!!',()=>{
            expect(sortCharacters({foo: 'foo',bar: 'bar'})).not.toEqual(sortCharacters({demo: 'demo',Str: 'String'}));
        })
    });
    describe('keccakHash',()=>{
        it('Produces a valid Keccak256 Hash!!',()=>{
            expect(keccakHash({bar:'bar',foo:'foo'})).toEqual('2b6869258eb19ba9f212e1e6366f4480e1672108b0102e92bdb385cfe79d3edd');
        })
    })
});