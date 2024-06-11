// lib/utils/propCopy
"use strict";

/**
 * Copies only named properties from source to destination object.
 *
 * @param {Object} dst destination object
 * @param {Object} src source object
 * @param {String|Array} names property names to copy
 */
function propCopy(dst, src, names) {
  if (!Array.isArray(names))
    names = [names];

  for (let name of names)
    if (Object.hasOwn(src, name))
      dst[name] = src[name];
}

module.exports = exports = propCopy;
