const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
require('dotenv').config();

jest.setTimeout(30000);

beforeAll(async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_URI_TEST_DB);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Model', () => {
    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should create a user with valid data', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'Passw0rd' };
        const user = new User(userData);
        await user.save();

        const savedUser = await User.findOne({ email: 'john@example.com' });
        expect(savedUser).toBeDefined();
        expect(savedUser.name).toBe('John Doe');
        expect(savedUser.email).toBe('john@example.com');
    });

    it('should throw a ValidationError for name shorter than 3 characters', async () => {
        const userData = { name: 'Jo', email: 'john@example.com', password: 'Passw0rd' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.name.message).toContain('Name must be at least 3 characters long.');
        }
    });

    it('should throw a ValidationError for name longer than 50 characters', async () => {
        const userData = {
            name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            email: 'john@example.com',
            password: 'Passw0rd',
        };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.name.message).toContain('Name cannot be more than 50 characters long.');
        }
    });

    it('should throw a ValidationError for invalid email format', async () => {
        const userData = { name: 'John Doe', email: 'johnexample.com', password: 'Passw0rd' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.email.message).toContain('Please provide a valid email');
        }
    });

    it('should throw a ValidationError for email already in use', async () => {
        const existingUser = { name: 'Jane Doe', email: 'jane@example.com', password: 'Passw0rd' };
        await User.create(existingUser);

        const userData = { name: 'John Doe', email: 'jane@example.com', password: 'Passw0rd' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error.code).toBe(11000);
            expect(error.message).toContain('E11000 duplicate key error');
        }
    });

    it('should throw a ValidationError for password shorter than 6 characters', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: '12345' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.password.message).toContain('at least 6 characters');
        }
    });

    it('should throw a ValidationError for password without a lowercase letter', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'PASSWORD1' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.password.message).toContain('Password must include at least one lowercase letter.');
        }
    });

    it('should throw a ValidationError for password without an uppercase letter', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'password1' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.password.message).toContain('Password must include at least one uppercase letter.');
        }
    });

    it('should throw a ValidationError for password without a digit', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'Password' };
        try {
            await User.create(userData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.password.message).toContain('Password must include at least one digit.');
        }
    });

    it('should save the password as a hashed value', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'Passw0rd' };
        const user = new User(userData);
        await user.save();

        const savedUser = await User.findOne({ email: 'john@example.com' });
        expect(savedUser.password).not.toBe(userData.password);
        expect(await bcrypt.compare(userData.password, savedUser.password)).toBe(true);
    });
});
