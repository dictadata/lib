
const _compare = require('../lib/test/compare');

let retCode = _compare("./test/data/input/foofile.json.gz", "./test/data/input/foofile.json");
console.log(retCode);

retCode = _compare("./test/data/input/foofile_01.json", "./test/data/input/foofile.json");
console.log(retCode);