const match = require('../lib/utils/match.js');

let lookup = {
  NAME: /YADKIN/i
};

let construct =
{
  NAME: "Yadkin"
};

console.log(match(lookup, construct));
