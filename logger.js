const winston = require('winston');

const myCustomLevels = {
    levels: {
        info: 0,
        warn: 1,
        error: 2,
        debug: 3,
        data: 2,
        command: 3,
        transaction: 2
    },
    colors: {
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        debug: 'green',
        data: 'white',
        command: 'brightMagenta',
        transaction: "brightCyan"
    }
}

winston.addColors(myCustomLevels.colors);

const logger = winston.createLogger({
    level: 'debug',
    levels: myCustomLevels.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(info => `${new Date().toISOString()} ${info.level}: ${info.message}`),
    ),
    transports: [
        new (winston.transports.Console)()
    ]
});

logger.info('Logger has started');

module.exports = logger