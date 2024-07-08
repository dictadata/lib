/**
 * lib/utils/match.js
 *
 * Compares a multi-field expressions object against an source data object.
 */
"use strict";

const typeOf = require('./typeOf');
const dot = require('./dot');

/* example match expressions
  // must match all criteria to return true
  {
    "field1": 'value',
    "field2": {
      gt: 100,
      lt: 200
    },
    "field3": ['value1','value2',...],
    "field4": /ab+c/i
  }
*/

/* operators
  'eq'     - field equal to value, same as "field1": 'value' criteria
  'neq'    - field not equal to value
  'lt'     - field less than value
  'lte'    - field less than or equal to value
  'gt'     - field greater than value
  'gte'    - field greater than or equal to value
  'wc'     - field matches a string value containing wildcard characters '?', '*'
  'in'     - field value in array of values
  'exists' - field exists in construct, value is ignored
*/

/**
 * If criteria is a regexp, "/.../g", then create a RegExp
 * @param {string} criteria
 * @returns a RegExp or null
 */
function makeRegExp(criteria) {

  try {
    if (criteria instanceof RegExp)
      return criteria;

    if (typeOf(criteria) === "string" && criteria && criteria[ 0 ] === '/') {
      let l = criteria.lastIndexOf('/');
      if (l > 0) {
        let pattern = criteria.substring(1, l);
        let flags = criteria.substring(l + 1);
        let rx = new RegExp(pattern, flags);
        return rx;
      }
    }
  } catch (e) {
    // no op
  }

  return null;
}

/**
 * test str with a RegExp created from rule containing wildcard characters
 * @param {string} value - string to compare
 * @param {string} rule - string to compare against, may contain wildcard characters
 * @returns
 */
function wildcard(value, rule) {
  // remove anything that could interfere with regex
  rule = rule.replace(/([.+^=!:${}()|\[\]\/\\])/g, "\\$1");
  rule = rule.replace(/\?/g, ".");
  rule = rule.replace(/\*/g, ".*");
  let matched = new RegExp("^" + rule + "$").test(value);
  return matched;
}

module.exports = exports =
  /**
   *
   * @param {Object} expressions - object with match expressions
   * @param {Object} construct  - object with fields to check
   * @param {Object} options
   * @param {Boolean} options.ignoreCase
   */
  function match(expressions, construct, options) {
    if (typeOf(expressions) !== "object")
      return false;
    let matched = true;

    // match all expressions
    for (let [ name, criteria ] of Object.entries(expressions)) {
      let value = dot.get(name, construct);
      let rx = makeRegExp(criteria); // could be null

      let exists = typeOf(value) !== "undefined";
      //let exists = Object.hasOwn(construct,name);

      if (Array.isArray(criteria)) {
        matched = exists && criteria.includes(value);
      }
      else if (rx) {
        matched = exists && rx.test(value);
      }
      else if (typeOf(criteria) === 'object') {
        // criteria(s) { op: value, ...}
        for (let [ op, opValue ] of Object.entries(criteria)) {
          switch (op) {
            case 'eq': matched = exists && (value == opValue); break;
            case 'neq': matched = !exists || (value != opValue); break;
            case 'lt': matched = exists && (value < opValue); break;
            case 'lte': matched = exists && (value <= opValue); break;
            case 'gt': matched = exists && (value > opValue); break;
            case 'gte': matched = exists && (value >= opValue); break;
            case 'wc': matched = exists && wildcard(value, opValue); break;
            case 'in': matched = exists && Array.isArray(opValue) && opValue.includes(value); break;
            case 'exists':
              matched = (exists === opValue);
              break;
            default: break;  // ignore bad operators
          }
        }
      }
      else {
        // single property { field: value }
        matched = exists && (value == criteria);
      }

      // check short-circuit
      if (!matched)
        break;
    }

    return matched;
  };
