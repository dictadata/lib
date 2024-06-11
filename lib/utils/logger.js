/**
 * lib/logger.js
 *
 * Default is a simple logger that writes to the console.
 * For a daily file logger call configDaily().
 */
"use strict";

const winston = require('winston');
const { format, transports } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');

const _logger = winston;
const _level = process.env.LOG_LEVEL || 'info';

// configure a simple logger when module loads.
winston.configure({
  level: _level,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true })
  ),
  transports: [
    // stdout
    new transports.Console({ format: format.cli() }),
    // stderr
    new transports.Console({ format: format.json(), level: 'error' })
  ]
});

/**
 * default options for daily logger
 */
var defaultOptions = {
  logPath: "./log",
  logPrefix: "app",
  logLevel: 'info',
  logConsole: true
};

/**
 * configure a daily rotating file logger
 *
 * @param {object} options
 * @param {string} options.logLevel
 * @param {string} options.logPath
 * @param {string} options.logPrefix
 * @param {boolean} options.logConsole
 */
_logger.configDaily = function (options) {
  options = Object.assign({}, defaultOptions, options);

  _logger.level = process.env.LOG_LEVEL || options.logLevel || 'info';

  // note lib-junctions logger defines console output
  // remove lib-junction console transports
  if (!options.logConsole && process.env.NODE_ENV !== 'development' )
    _logger.clear();

  // add file output
  _logger.add( new DailyRotateFile({
    format: format.logstash(),
    dirname: options.logPath,
    filename: options.logPrefix + '-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '100m',
    maxFiles: (process.env.NODE_ENV === 'development') ? '1d' : '31d'
  }) );

};

module.exports = exports = _logger;
