# @dictadata/lib README 1.0.x

## Install

```
npm i github:dictadata/lib#semver:^1.0
```

## Usage

```javascript
// logger is instance of the one and only Winston logger.
const { logger } = require('@dictadata/lib');
// configDaily() MUST be called to configure the rotating file logger.
logger.configDaily(options)

// utility functions
const { typeOf, isDate } = require('@dictadata/lib');

// node.js HTTP client
const { httpRequest } = require('@dictadata/lib');

// testing
const { compare, output } = require('@dictadata/lib/test');
```

## Logger Modules

* logger - Default is a simple logger that writes to the console. For a daily file logger call logger.configDaily().

## Utility Modules

* typeOf - Returns base type of objects like "string", "array", "date", "regexp" or the object's constructor name.
* isUUID - Returns true if value is a valid string form of a UUID.
* isDate - Returns true if value is a local date, ISO date, time part is optional.
* isBoolean - Returns true if string value is boolean representation; 'true'|'false', 0|1, yes|no, y|n, on|off.

* objCopy - Deep copy/replace target properties with source object(s) properties.
* propCopy - Copies only named properties from source to destination object.
* dot.get - Find an object property using dot notation.
* dot.set - Set an object property value using dot notation.
* getCI - Get object property with case-insensitive key.

* parseDate - Parse an ISO date string.
* formatDate - Returns ISO date string, truncates time if zero.

* match - Compares a multi-field filtering expression against an object.
* evaluate - Use an '=expression' to calculate a value from an object's properties and literal values.
* replace - Text replacement of "${name}" templates in a string.

* findFile - Walk up directory tree from current directory searching for filename.
* findModules - Given a directory walk up directory tree looking for node_modules folder.

* httpRequest - Wrapper for Node.js HTTP, HTTPS and HTTP/2 modules. Takes some Axios style request config options.
* htmlParseDir - Parse directory entries from an HTML directory response.
* censusParams - Convert api.census.gov style URL query parameters to a dictadata storage pattern.

## Test Modules

* compare - compare JSON or text (CSV) files for differences.
* output - writes data to an output file and optionally compares to expected file.
* http_queries - Read a JSON file that defines the HTTP tests. Run the tests defined in the "queries" array.
* process_events - node:process event handlers for debug testing

* tr_launcher - CLI utility that reads the .vscode/launch.json file and runs the matching tests.
* tr_http_queries - CLI test client for testing HTTP storage-node servers using http_queries utility.
