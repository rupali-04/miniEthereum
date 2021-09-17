const Transaction = require('./index');
const Account = require('../account');

describe('Transaction',()=>{
    let account, standardTransaction, createTransaction;

    beforeEach(()=>{
        account = new Account();
        standardTransaction = Transaction.createTransaction({
            account,
            to: 'foo-recipient',
            value: 50
        });
        createAccountTransaction = Transaction.createTransaction({
            account
        });
    });

    describe('validateStandardTransaction()',() => {
        it('validates a valid transaction',()=>{
            expect(Transaction.validateStandardTransaction({
                transaction: standardTransaction
            })).resolves;
        });
        it('dose not validate a Invalid Transaction',()=>{
            standardTransaction.to = 'different-recipent';

            expect(Transaction.validateStandardTransaction({
                transaction: standardTransaction
            })).rejects.toMatchObject({message: /invalid!!/});
        });
    });
    describe('validateCreateAccountTransaction()',() => {
        it('validates a valid Create account transaction',()=>{
            expect(Transaction.validateCreateAccountTransaction({
                transaction: createAccountTransaction
            })).resolves;
        });
        it('dose not validate a Invalid Create account Transaction',()=>{
            expect(Transaction.validateCreateAccountTransaction({
                transaction: standardTransaction
            })).rejects.toMatchObject({message: /field/});
        });
    });
});