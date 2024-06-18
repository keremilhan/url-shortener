const mongoose = require('mongoose');
const Url = require('../../models/Url');
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

describe('Url Model', () => {
    afterEach(async () => {
        await Url.deleteMany({});
    });

    it('should create a URL with valid data', async () => {
        const urlData = { target: 'http://example.com', short: 'exmpl' };
        const url = new Url(urlData);
        await url.save();

        const savedUrl = await Url.findOne({ short: 'exmpl' });
        expect(savedUrl).toBeDefined();
        expect(savedUrl.target).toBe('http://example.com');
        expect(savedUrl.short).toBe('exmpl');
        expect(savedUrl.clicks).toBe(0);
    });

    it('should throw a ValidationError for target URL longer than 150 characters', async () => {
        const urlData = { target: 'a'.repeat(151), short: 'exmpl' };
        try {
            await Url.create(urlData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.target.message).toContain('Url cannot be more than 150 characters long.');
        }
    });

    it('should throw a ValidationError for short URL shorter than 3 characters', async () => {
        const urlData = { target: 'http://example.com', short: 'ex' };
        try {
            await Url.create(urlData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.short.message).toContain('Short url must be at least 3 characters long.');
        }
    });

    it('should throw a ValidationError for short URL longer than 20 characters', async () => {
        const urlData = { target: 'http://example.com', short: 'a'.repeat(21) };
        try {
            await Url.create(urlData);
        } catch (error) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.short.message).toContain('Short url cannot be more than 20 characters long.');
        }
    });

    it('should throw a E11000 duplicate key error for duplicate short URL', async () => {
        const urlData1 = { target: 'http://example1.com', short: 'exmpl' };
        const urlData2 = { target: 'http://example2.com', short: 'exmpl' };

        const url1 = new Url(urlData1);
        await url1.save();

        try {
            await Url.create(urlData2);
        } catch (error) {
            expect(error.code).toBe(11000);
            expect(error.message).toContain('E11000 duplicate key error');
        }
    });
});
