/**
 * storage/utils/exists.js
 */
const { stat } = require('node:fs/promises');

/**
 * Checks to determine if there is a directory entry for the file or folder
 *
 * @param {string} pathname to file or folder
 */
module.exports = exports = async (pathname) => {
  let entry;
  try {
    entry = await stat(pathname);
  }
  catch (err) {
    // console.debug(err.message);
  }

  return entry;
}
