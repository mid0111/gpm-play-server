const log4js = require('log4js');
const fs = require('fs-extra');
const path = require('path');
const config = require('jsonconfig');

config.load([path.join(__dirname, '../../config/log.json')]);


// Create log directory when it does not exist.
fs.mkdirsSync('logs');

const nodeEnv = process.env.NODE_ENV || 'production';
log4js.configure(config.log[nodeEnv]);

const appLogger = log4js.getLogger('app');
const errorLogger = log4js.getLogger('error');

class Logger {

  static info(...args) {
    appLogger.info(...args);
  }

  static error(...args) {
    appLogger.error(...args);
    errorLogger.error(...args);
  }

}

module.exports = Logger;
