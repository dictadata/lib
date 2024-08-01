/**
 * storage/utils/waitFor.js
 */

/**
 * Checks to determine if there is a directory entry for the file or folder
 *
 * @param {string} pathname to file or folder
 */
module.exports = exports = async (obj, prop, value) => {
  return new Promise((resolve) => {
    while (obj[prop] !== value) {
      process.nextTick(() => {});
    }
    resolve(true);
  })
}
