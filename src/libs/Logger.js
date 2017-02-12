const log4js = require('log4js');
const fs = require('fs-extra');

// Create log directory when it does not exist.
fs.mkdirsSync('logs');

log4js.configure({
  appenders: [
    { type: 'file', filename: 'logs/app.log', category: 'app' },
    { type: 'file', filename: 'logs/error.log', category: 'error' },
  ],
});

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
