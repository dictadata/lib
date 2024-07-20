/**
 * lib/utils/dot.js
 */
"use strict";

const typeOf = require('./typeOf');

/**
   * find an object property using dot notation
   * @param {object} construct object to pick
   * @param {string} dotname property name using dot notation
   * @returns the object property
   */
exports.has = function has(construct, dotname) {
  let props = dotname.split('.');

  let prop;
  try {
    prop = props.reduce((prop, name) => {
      if (typeof prop !== "object")
        return prop;
      let nv = name.split('=');
      if (!prop)
        return prop;
      else if (nv.length === 2)
        return prop.find((value) => value[ nv[ 0 ] ] === nv[ 1 ]);
      else
        return prop[ name ];
    }, construct);
  }
  catch (err) {
    console.warn("dot.has: " + err.message);
  }

  return prop !== undefined;
};

/**
   * find an object property using dot notation
   * @param {object} construct object to pick
   * @param {string} dotname property name using dot notation
   * @returns the object property
   */
exports.get = function get(construct, dotname) {
  let props = dotname.split('.');

  let prop;
  try {
    prop = props.reduce((prop, name) => {
      if (typeof prop !== "object")
        return prop;
      let nv = name.split('=');
      if (!prop)
        return prop;
      else if (nv.length === 2)
        return prop.find((value) => value[ nv[ 0 ] ] === nv[ 1 ]);
      else
        return prop[ name ];
    }, construct);
  }
  catch (err) {
    console.warn("dot.get: " + err.message);
  }

  return prop;
};

/**
   * set an object property to value using dot notation
   * @param {object} construct object to pick
   * @param {string} dotname property name using dot notation
   * @param {*} value new value for property
   * @returns true if successful, false if invalid dot notation for construct
   */
exports.set = function set(construct, dotname, value) {
  let names = dotname.split(".");
  let vname = names.pop();

  let prop = construct;
  try {
    for (let name of names) {
      let nv = name.split('=');
      if (nv.length === 2)
        prop = prop.find((value) => value[ nv[ 0 ] ] === nv[ 1 ]);
      else {
        if (!Object.hasOwn(prop, name))
          prop[ name ] = {};
        prop = prop[ name ];
      }
    }
  }
  catch (err) {
    console.warn("dot.set: " + err.message);
  }

  if (typeOf(prop) === "array")
    prop.push(value);
  else if (typeOf(prop) === "object")
    prop[ vname ] = value;
  else
    return false;

  return true;
};
