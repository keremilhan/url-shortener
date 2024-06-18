const CustomAPIError = require('./custom-api');

class DuplicateEmailError extends CustomAPIError {
    constructor() {
        super('This email is already in use. Please use another email.');
    }
}

module.exports = DuplicateEmailError;
