const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');

const routes = require('./routes');
const Logger = require('./libs/Logger');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  /* eslint-enable */

  Logger.error('Unhandled error', err);

  const response = {
    error: {
      message: err.message,
    },
  };

  if (app.get('env') === 'development') {
    // development error handler will print stacktrace
    response.error.detail = err;
  }

  res.status(err.status || 500);
  res.json(response);
});

/**
 * Get port from environment and store in Express.
 */
const port = 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
server.listen(port);

/**
 * Create Socket server.
 */
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('song', (data) => {
    // broadcast
    io.emit('song', data);
  });
});

module.exports = server;
