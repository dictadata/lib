/**
 * lib/utils/evaluate.js
 *
 * Use an '=expression' to calculate a value from an object's properties and literal values.
 */
"use strict";

const dot = require('./dot');

// expression
//   literal
//   =expression-value
//   /=expression-value/[flags]
//
// literal
//   string value, with single quote ' delimiter character
//
// expression-value
//   exp-value
//   exp-value op exp-value op ...
//   field-name/regexp[/flags]/replace[:padding]
//
// op
//   + | - | * | /
//
// exp-value
//   'string' | number | boolean | field-name[:padding]
//
// boolean
//   "true" | "false"
//
// field-name
//   name | dot-notation
//
// field-name/regexp[/flags]/replace
//   field-name - a field that contains string value
//   regexp - regular expression
//   flags - regular expression flags, optional
//   replace - replacement string using $ notation to insert capture groups
//
// padding
//   length,prefix[,suffix]
//
// length
//   desired length of string value
//
// prefix
//   prefix string for start padding, ignored if suffix specified
//
// suffix
//   suffix string for end padding
//
// notes:
//   An expression-value of a single field name results in underlying type, e.g. string, number, boolean.
//   Concatenation will result in a string if any exp-value results in a string.
//   Field-names cannot be "true", "false" or contain characters =+/:
//   Concatenating boolean values will have unexpected results.
//   Regular expressions cannot contain + characters use {1,} instead, e.g. .{1,} instead of .+
//   If using padding then regexp and replace values cannot contain character :
//
// example expressions
//   "literal"
//   "=fieldname"
//   "=prop.fieldname
//   "=fieldname+'literal'+..."
//   "='literal'+prop.fieldname+..."
//   "=fieldname/regexp/replacement"
//   "=fieldname:0,3
//   "=fieldname:,3,0"
//

module.exports = exports =
  /**
     * Get value from field(s) and/or literal values
     * @param {*} construct object to pick values from
     * @param {*} expression in the form "=[prop.]fieldname+'literal'+..."
     */
  function evaluate(expression, construct) {
    if (!expression || typeof expression != "string")
      return expression;

    if (expression[ 0 ] === '/') {
      let exp = expression.substring(1, expression.lastIndexOf("/"));
      let flags = expression.substring(expression.lastIndexOf("/") + 1);
      let evil = evaluate(exp, construct);
      return RegExp(evil, flags);
    }
    else if (expression[ 0 ] !== '=')
      return expression;

    // regexp, e.g. =fieldname/regexp/replace:padding
    // expression has to have two / and not contained in a literal
    // side effect: can only have one division operator in the expression
    if (expression.indexOf("/") !== expression.lastIndexOf("/")
      && expression.indexOf("/") > expression.lastIndexOf("'")) {
      let value;

      const [ exp, padding ] = expression.substring(1).split(':');
      // check for regular expression
      let parts = exp.split('/');
      if (parts.length >= 3) {
        let flags   = (parts.length === 4) ? parts[ 2 ] : "";
        let replace = (parts.length === 4) ? parts[ 3 ] : parts[ 2 ];
        // get field value
        let fldval = dot.get(construct, parts[ 0 ]);
        // create regexp
        let rx = RegExp(parts[ 1 ], flags);
        // run regexp on field value
        value = fldval.replace(rx, replace);
      }

      return padit(value, padding);
    }

    // "=field1+'literal'*field3/field4-field5"
    // operators: =+-*/
    let rx = /([\=\+\-\*\/])(\'.*?\'|[A-Za-z0-9_@#$. ]*)/g;
    let parts;
    let result;
    while ((parts = rx.exec(expression)) !== null) {
      if (!parts || parts.length !== 3 || parts[ 1 ] === '')
        return result;

      let value;
      const [ p, padding ] = parts[ 2 ].split(':');

      if (p && p[ 0 ] === "'") {
        // literal string
        value = p.substring(1, p.length - 1);
      }
      else if (isFinite(p)) {
        // number
        value = Number.parseFloat(p);
      }
      else if (p === "true" || (p === "false")) {
        // boolean
        value = (p === "true");
      }
      else {
        // field name
        value = dot.get(construct, p);
      }

      value = padit(value, padding);

      switch (parts[ 1 ]) {
        case "=":
          result = value;
          break;
        case "+":
          // add numbers, concatenate strings
          result = result + value;
          break;
        case "-":
          result = result - value;
          break;
        case "*":
          result = result * value;
          break;
        case "/":
          if (value === 0)
            result = undefined;
          else
            result = result / value;
          break;
      }
    }

    return result;
  };

function padit(value, padding) {
  if (padding) {
    let args = padding.split(',');
    if (args.length === 3)
      value = value.padEnd(args[ 0 ], args[ 2 ]);
    else
      value = value.padStart(args[ 0 ], args[ 1 ]);
  }

  return value;
}
