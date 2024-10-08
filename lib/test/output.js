/**
 * test/output
 */
"use strict";

const compare = require('./compare');
const { logger } = require('../utils');
const fs = require('node:fs');
const path = require('node:path');

module.exports = exports = (output, data, compareValues) => {
  let retCode = 0;

  if (compareValues === undefined && process.env.NODE_ENV === "development") {
    compareValues = 2
  }

  if (typeof output === "string") {
    if (data) {
      logger.info("Saved data to: " + output);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, JSON.stringify(data, null, 2), "utf8");
    }

    if (compareValues) {
      // compare output
      let expected = output.replace("output", "expected");
      retCode = compare(output, expected, compareValues);
    }
  }
  else if (output && output.writable) {
    output.write(JSON.stringify(data, null, 2));
  }

  return process.exitCode = retCode;
};
