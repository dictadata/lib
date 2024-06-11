/**
 * test/tr_http_queries.js
 *
 * CLI test client for testing HTTP storage-node servers.
 *
 * Read a JSON file that defines the HTTP tests.
 * Run the tests defined in the "queries" array.
 * Top level properties define default values.
 * See http_queries_example.json.
 */
"use strict";

const httpQueries = require('./http_queries');

let testFile = process.argv.length > 2 ? process.argv[ 2 ] : "";
let testName = process.argv.length > 3 ? process.argv[ 3 ] : "";

(async () => {
  let exitCode = await httpQueries(testFile, testName);
  process.exitCode = exitCode;
})();
