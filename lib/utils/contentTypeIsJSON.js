// lib/utils/contentTypeIsJSON
"use strict";

/**
 *
 * @param {*} contentType
 * @returns
 */
module.exports = exports = function contentTypeIsJSON(contentType) {
  if (!contentType)
    return false;

  let expressions = contentType.split(';');
  let [ type, value ] = expressions[ 0 ].split('/');
  if (value === 'json')
    return true;
  if (value.indexOf("+json") >= 0)
    return true;

  return false;
};
