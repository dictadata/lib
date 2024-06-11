var findFile = require('../lib/utils/findFile.js');

(async () => {
  console.log(await findFile("./package.json"));
  console.log(await findFile("../package.json"));
  console.log(await findFile("nonexistent.file") || "fileFile: not found");
})()
