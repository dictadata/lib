
const _compare = require('../lib/test/compare');

let retCode = _compare("./test/_data/input/foofile.json.gz", "./test/_data/input/foofile.json");
console.log(retCode);

retCode = _compare("./test/_data/input/foofile_01.json", "./test/_data/input/foofile.json");
console.log(retCode);
