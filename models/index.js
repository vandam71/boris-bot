const mongoose = require('mongoose');
const logger = require('../logger');

const reconnectTimeout = 5000; // 5 seconds

mongoose.connection.on('connected', function () {
    logger.info('Mongoose default connection open');
});

mongoose.connection.on('error', function (err) {
    logger.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    logger.info('Mongoose default connection disconnected. Attempting to reconnect in ' + reconnectTimeout / 1000 + ' seconds...');
    setTimeout(function() {
        mongoose.connect(process.env.MONGODB_URI).catch(err => logger.error('Mongoose reconnection error: ' + err));
    }, reconnectTimeout);
});

mongoose.connect(process.env.MONGODB_URI).catch(err => logger.error('Initial Mongoose connection error: ' + err));

module.exports = mongoose;