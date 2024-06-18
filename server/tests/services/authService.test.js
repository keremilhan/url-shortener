const User = require('../../models/User');
const { BadRequestError, UnauthenticatedError } = require('../../errors');
const { registerUser, loginUser } = require('../../services/authService');

jest.mock('../../models/User');

describe('userService', () => {
    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            User.create.mockResolvedValueOnce({
                email: 'test@example.com',
                name: 'Test User',
                createJWT: jest.fn().mockReturnValue('mockedToken'),
            });

            const userData = { email: 'test@example.com', name: 'Test User', password: 'password' };
            const result = await registerUser(userData);

            expect(User.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual({ email: 'test@example.com', name: 'Test User', accessToken: 'mockedToken' });
        });

        it('should throw BadRequestError when userData is missing', async () => {
            await expect(registerUser(undefined)).rejects.toThrow(BadRequestError);
        });
    });

    describe('loginUser', () => {
        it('should login a user successfully', async () => {
            const mockedUser = {
                email: 'test@example.com',
                name: 'Test User',
                comparePasswords: jest.fn().mockResolvedValue(true),
                createJWT: jest.fn().mockReturnValue('mockedToken'),
            };

            User.findOne.mockResolvedValueOnce(mockedUser);

            const result = await loginUser('test@example.com', 'password');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(mockedUser.comparePasswords).toHaveBeenCalledWith('password');
            expect(result).toEqual({ email: 'test@example.com', name: 'Test User', accessToken: 'mockedToken' });
        });

        it('should throw UnauthenticatedError when user is not found', async () => {
            User.findOne.mockResolvedValueOnce(null);
            await expect(loginUser('test@example.com', 'password')).rejects.toThrow(UnauthenticatedError);
        });

        it('should throw UnauthenticatedError when password is incorrect', async () => {
            const mockedUser = {
                email: 'test@example.com',
                name: 'Test User',
                comparePasswords: jest.fn().mockResolvedValue(false),
            };

            User.findOne.mockResolvedValueOnce(mockedUser);

            await expect(loginUser('test@example.com', 'password')).rejects.toThrow(UnauthenticatedError);
        });

        it('should throw BadRequestError when email or password is missing', async () => {
            await expect(loginUser()).rejects.toThrow(BadRequestError);
            await expect(loginUser('test@example.com')).rejects.toThrow(BadRequestError);
            await expect(loginUser(null, 'password')).rejects.toThrow(BadRequestError);
        });
    });
});
