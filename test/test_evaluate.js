const evaluate = require('../lib/utils/evaluate.js');

console.log(evaluate("=f1", { f1: 100 }));
console.log(evaluate("=f1+'ths'", { f1: 100 }));
console.log(evaluate("=f1+f2", { f1: 1, f2: 1}))
console.log(evaluate("=f1*f2", { f1: 2, f2: 2}))
console.log(evaluate("=f1-f2", { f1: 4, f2: 1}))
console.log(evaluate("=f1/f2", { f1: 8, f2: 2}))
console.log(evaluate("=f1/f2", { f1: 8, f2: 0}))
console.log(evaluate("=f1*f2-f3/f4*100+'%'", { f1: 8, f2: 2, f3: 4, f4: 16 }))
