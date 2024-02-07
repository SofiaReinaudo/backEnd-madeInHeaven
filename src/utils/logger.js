import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 1,
        http: 1,
        error: 1,
        warning: 1,
        info: 1,
        debug: 1
    }
}

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'fatal',
            format: winston.format.simple()
        }),
        new winston.transports.File({ filename: './loggerTest.log', level: 'fatal'})
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}