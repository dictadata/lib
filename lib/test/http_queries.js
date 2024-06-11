/**
 * lib/test/http_query.js
 *
 * Read a JSON file that defines the HTTP tests.
 * Run the tests defined in the "queries" array.
 * Top level properties define default values.
 * See http_queries_example.json.
 */
"use strict";

const httpRequest = require('../utils/httpRequest');
const compare = require('./compare');
const { readFile, writeFile } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');
require('colors');

module.exports = exports = httpQueries;

var request_defaults = {
  method: "GET",
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': "@dictadata/lib http client"
  }
};

async function httpQueries(queryFile, queryName) {
  console.log((queryFile + "  " + queryName).blue);

  let tf = await readFile(queryFile, "utf-8");
  let httpQueries = JSON.parse(tf);

  let outputDir = path.dirname(queryFile).replace("/test/", "/test/data/output/") + queryName + "/" + httpQueries.name + "/";
  fs.mkdirSync(outputDir, { recursive: true });

  let exitCode = 0;
  for (let query of httpQueries.queries) {
    if (!queryName || query.name.indexOf(queryName) >= 0) {
      console.log(query.name.cyan);
      let request = Object.assign({}, request_defaults, httpQueries.request, query.request);
      let expected = Object.assign({}, httpQueries.expected, query.expected);
      let outputFile = outputDir + query.name + ".results";

      if (typeof request.data === "string")
        request.data = JSON.parse(await readFile(request.data, "utf-8"));

      exitCode = await submitQuery(request, expected, outputFile);
      if (exitCode !== 0)
        break;
    }
  }

  console.log(("Process exitCode = " + exitCode).blue);
  return exitCode;
}

async function submitQuery(request, expected, outputFile) {
  //console.log("submitQuery");

  try {
    let retCode = 0;
    let url = request.url || '';
    let comp = url.split('/');
    for (let i = 0; i < comp.length; i++)
      comp[ i ] = encodeURIComponent(comp[ i ]);
    url = comp.join('/');

    // make request
    let response = await httpRequest(url, request, JSON.stringify(request.data));
    console.log(response.statusCode);

    let results;
    let isJSON = httpRequest.contentTypeIsJSON(response.headers[ "content-type" ]);
    if (isJSON) {
      results = JSON.parse(response.data);
      outputFile += ".json";
    }
    else {
      results = response.data;
      outputFile += ".txt";
    }

    // validate HTTP statusCode against expected
    if (Array.isArray(expected.statusCode) ? !expected.statusCode.includes(response.statusCode) : response.statusCode !== expected.statusCode) {
      console.log("  FAILED statusCode ".bgRed + response.statusCode + " " + response.data + ", expected " + expected.statusCode);
      retCode = 1;
    }
    // test query status against expected
    if (expected.status) {
      if (Array.isArray(expected.status) ? !expected.status.includes(results.status) : results.status !== expected.status) {
        console.log("  FAILED status ".bgRed + results.status + ", expected " + expected.status);
        retCode = 1;
      }
    }
    //
    if (expected.match_fail) {
      if (response.data.indexOf(expected.match_fail) >= 0) {
        console.log("  FAILED fail text found: ".bgRed + expected.match_fail);
        retCode = 1;
      }
    }
    if (expected.match_success) {
      if (response.data.indexOf(expected.match_success) < 0) {
        console.log("  FAILED success text NOT found: ".bgRed + expected.match_success);
        retCode = 1;
      }
    }

    console.log("output: ", outputFile);
    if ([200, 201, 409].includes(response.statusCode)) {
      await writeFile(outputFile, isJSON ? JSON.stringify(results, null, 2) : results, "utf8");
    }
    else {
      let fd = fs.openSync(outputFile, 'w');
      await fs.writeSync(fd, "HTTP/" + response.httpVersion + " " + response.statusCode + " " + response.statusMessage + "\n");
      for (let [ name, value ] of Object.entries(response.headers))
        await fs.writeSync(fd, name + ": " + value + "\n");
      if (response.data) {
        await fs.writeSync(fd, "\n" + response.data);
        await fs.closeSync(fd);
      }
    }

    if (retCode === 0 && response.data && isJSON) {
      // compare output files to expected
      let expected_output = outputFile.replace("output", "expected");
      let compareValues = Object.hasOwn(expected, "compareValues") ? expected.compareValues : 2;
      retCode = compare(outputFile, expected_output, compareValues);
    }

    return retCode;
  }
  catch (err) {
    if (err.response) {
      if (Array.isArray(expected.statusCode) && expected.statusCode.includes(err.response.statusCode))
        return 0;
      else if (err.response.statusCode === expected.statusCode)
        return 0;

      if (err.response.statusCode !== 500)
        console.log("FAILED status ".bgRed + err.response.statusCode + " " + err.response.data + ", expected " + expected.statusCode);
      else
        console.log("FAILED ".bgRed + err.stack);
    }
    else {
      console.log("FAILED  ".bgRed + err);
    }

    return 1;
  }
}
