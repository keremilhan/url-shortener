const mongoose = require('mongoose');
const { BadRequestError } = require('../errors');

const UrlSchema = new mongoose.Schema(
    {
        target: {
            type: String,
            required: true,
            validate: {
                validator: url => {
                    let error = '';
                    if (url.length > 150) {
                        error = 'Url cannot be more than 150 characters long.';
                    }

                    if (error) {
                        throw new BadRequestError(error);
                    }

                    return true;
                },
                message: 'Invalid url.',
            },
        },
        short: {
            type: String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: shortUrl => {
                    let error = '';

                    if (shortUrl.length < 3) {
                        error = 'Short url must be at least 3 characters long.';
                    }
                    if (shortUrl.length > 20) {
                        error = 'Short url cannot be more than 20 characters long.';
                    }

                    if (error) {
                        throw new BadRequestError(error);
                    }

                    return true;
                },
                message: 'Invalid short url.',
            },
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Url', UrlSchema);
