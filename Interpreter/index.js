const STOP = 'STOP';
const ADD = 'ADD';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';
const PUSH = 'PUSH';
const LT = 'LT';
const GT = 'GT';
const EQ ='EQ';
const AND = 'AND';
const OR = 'OR';
const JUMP = 'JUMP';
const JUMPI = 'JUMPI';

class Interpreter {
  constructor() {
    this.state = {
      programCounter: 0,
      stack: [],
      code: [],
      executionLimit: 0
    };
  }

  // Helper funtion for jump
  jump(){
    const destination = this.state.stack.pop();

    if(destination<0 || destination>this.state.code.length){
      throw new Error(`Invalid destination ${destination}`);
    }
    this.state.programCounter = destination;
    this.state.programCounter--;
          
  }

  runCode(code) {
    this.state.code = code;

    while (this.state.programCounter < this.state.code.length) {
      this.state.executionLimit++;
      if(this.state.executionLimit > 10000){
        throw new Error(`Execution Limit is excceded!!`);
      }
      const opCode = this.state.code[this.state.programCounter];

      try {
        switch (opCode) {
          case STOP:
            throw new Error('Execution complete');
          case PUSH:
            this.state.programCounter++;
            if(this.state.programCounter === this.state.code.length){
              throw new Error(`The 'PUSH'can not be at the end!!`);
            }
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value);
            break;
          case DIV:
          case MUL:
          case SUB:   
          case ADD:
          case LT:
          case GT:
          case EQ:
          case AND:
          case OR:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();
            let res;
            
            if(opCode === ADD) res = a + b;
            if(opCode === SUB) res = a - b;
            if(opCode === DIV) res = a / b;
            if(opCode === MUL) res = a * b;
            if(opCode === LT) res = a < b ? 1 : 0;
            if(opCode === GT) res = a > b ? 1 : 0;
            if(opCode === AND) res = a && b;
            if(opCode === OR) res = a || b; 
            this.state.stack.push(res);
          break;
          case JUMP: 
            this.jump();
          break; 
          case JUMPI: 
            const condition = this.state.stack.pop();
            
            if(condition === 1){
              this.jump();
            }
          break;
          default:
            break;
        }
      } catch (error) {

        if(error.message == 'Execution complete'){
          return this.state.stack[this.state.stack.length-1];
        }
        throw error;
        
      }

      this.state.programCounter++;
    }
  }
}

const code = [PUSH, 0,JUMP, PUSH, 'Sucucess: True',PUSH];
try{
  const res = new Interpreter().runCode(code);
  console.log("Result: ",res);

}catch(err){
  console.log('Error:',err.message);
}

