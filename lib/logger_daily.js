/**
 * lib/logger_daily
 */
"use strict";

// use the logger which is the Winston logger
const logger = require('./logger');
const { format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

logger.level = process.env.LOG_LEVEL || 'info';

var defaultOptions = {
  logPath: "./log",
  logPrefix: "app",
  logLevel: 'info',
  logConsole: true
};

// configure a daily rotating logger
logger.configLogger = function (options) {
  options = Object.assign({}, defaultOptions, options);

  logger.level = process.env.LOG_LEVEL || options.logLevel || 'info';

  // note lib-junctions logger defines console output
  // remove lib-junction console transports
  if (!options.logConsole && process.env.NODE_ENV !== 'development' )
    logger.clear();

  // add file output
  logger.add( new DailyRotateFile({
    format: format.logstash(),
    dirname: options.logPath,
    filename: options.logPrefix + '-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '100m',
    maxFiles: (process.env.NODE_ENV === 'development') ? '1d' : '31d'
  }) );

};

module.exports = exports = logger;
