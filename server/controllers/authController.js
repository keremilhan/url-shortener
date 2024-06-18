const { StatusCodes } = require('http-status-codes');
const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await registerUser(userData);
        res.status(StatusCodes.CREATED).json({ user, message: 'You have successfully registered' });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        res.status(StatusCodes.OK).json({ user, message: 'Login successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
