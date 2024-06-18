const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        validate: {
            validator: name => {
                const errors = [];

                if (name.length < 3) {
                    errors.push('Name must be at least 3 characters long.');
                }
                if (name.length > 50) {
                    errors.push('Name cannot be more than 50 characters long.');
                }

                if (errors.length > 0) {
                    throw new BadRequestError(JSON.stringify({ name: errors }));
                }

                return true;
            },
            message: 'Invalid name.',
        },
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        required: [true, 'Please provide email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        validate: {
            validator: function (password) {
                const errors = [];

                if (password.length < 6) {
                    errors.push('6 characters');
                }
                if (!/(?=.*[a-z])/.test(password)) {
                    errors.push('one lowercase letter');
                }
                if (!/(?=.*[A-Z])/.test(password)) {
                    errors.push('one uppercase letter');
                }
                if (!/(?=.*\d)/.test(password)) {
                    errors.push('one digit');
                }

                if (errors.length > 0) {
                    throw new BadRequestError(
                        JSON.stringify({
                            password: `Password must include at least ${errors.join(', ')}.`,
                        })
                    );
                }

                return true;
            },
            message: 'Invalid password.',
        },
    },
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userId: this._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};
module.exports = mongoose.model('User', UserSchema);
