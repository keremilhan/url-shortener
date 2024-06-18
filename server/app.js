require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
// extra security packages
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const connectDB = require('./db/connect');

const authRouter = require('./routes/auth');
const urlsRouter = require('./routes/urls');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

/**
 * Middleware for simulating backend response latency during development.
 *
 * This middleware adds a delay of specified milliseconds to the server's response,
 * mimicking real-world conditions where backend operations may take time.
 *
 * Use this middleware in the development process to test frontend behavior under
 * varying response times. It should be removed or disabled before deploying to
 * production environments to ensure optimal performance.
 */
// const delayMiddleware = require('./middleware/delay');
// app.use(delayMiddleware(2000));

/**
 * Rate limiter middleware configuration
 *
 * Limits each IP to a maximum of 100 requests per 15-minute window.
 * If the limit is exceeded, a 429 status code and a custom error message are returned.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
            msg: 'Too many requests from this IP, please try again later.',
        });
    },
});

app.set('trust proxy', 1);

app.use(
    cors({
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.options('*', cors());

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(limiter);

//routes
app.use('/auth', authRouter);
app.use('/', urlsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
