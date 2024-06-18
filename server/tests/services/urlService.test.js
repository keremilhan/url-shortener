const Url = require('../../models/Url');
const { NotFoundError, BadRequestError } = require('../../errors');
const { getAllUrls, getUrlById, createUrl, updateUrl, deleteUrl } = require('../../services/urlService');
const { formatUrl, isValidUrl, generateUniqueId } = require('../../utils/utils');

jest.mock('../../models/Url');
jest.mock('../../utils/utils');

describe('urlService', () => {
    describe('getAllUrls', () => {
        it('should return all URLs for a given user ID', async () => {
            const userId = 'user123';
            const mockUrls = [{ url: 'example.com' }, { url: 'test.com' }];
            Url.find.mockResolvedValueOnce(mockUrls);

            const result = await getAllUrls(userId);

            expect(Url.find).toHaveBeenCalledWith({ createdBy: userId });
            expect(result).toEqual(mockUrls);
        });
    });

    describe('getUrlById', () => {
        it('should return URL by ID and increment clicks', async () => {
            const urlId = 'url123';
            const mockUrl = { short: urlId, clicks: 0, save: jest.fn().mockResolvedValueOnce() };
            Url.findOne.mockResolvedValueOnce(mockUrl);

            const result = await getUrlById(urlId);

            expect(Url.findOne).toHaveBeenCalledWith({ short: urlId });
            expect(mockUrl.clicks).toBe(1);
            expect(mockUrl.save).toHaveBeenCalled();
            expect(result).toEqual(mockUrl);
        });

        it('should throw NotFoundError if URL is not found', async () => {
            const urlId = 'nonexistent';
            Url.findOne.mockResolvedValueOnce(null);

            await expect(getUrlById(urlId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('createUrl', () => {
        it('should create a new URL', async () => {
            const target = 'example.com';
            const userId = 'user123';
            const formattedUrl = 'https://example.com';
            const uniqueId = 'abc1234';
            const mockUrl = { target: formattedUrl, short: uniqueId, createdBy: userId };

            formatUrl.mockReturnValueOnce(formattedUrl);
            isValidUrl.mockReturnValueOnce(true);
            generateUniqueId.mockReturnValueOnce(uniqueId);

            Url.mockImplementation(() => {
                return {
                    ...mockUrl,
                    save: jest.fn().mockResolvedValue(mockUrl),
                };
            });

            const result = await createUrl(target, userId);

            expect(formatUrl).toHaveBeenCalledWith(target);
            expect(isValidUrl).toHaveBeenCalledWith(formattedUrl);
            expect(generateUniqueId).toHaveBeenCalled();
            expect(result).toMatchObject({ target: formattedUrl, short: uniqueId, createdBy: userId });
        });
    });

    it('should throw Error if URL is invalid', async () => {
        const target = 'invalid-url';
        const userId = 'user123';
        formatUrl.mockReturnValueOnce(target);
        isValidUrl.mockReturnValueOnce(false);

        try {
            await createUrl(target, userId);
        } catch (error) {
            expect(error.message).toContain('Invalid URL.');
        }
    });

    it('should throw Error if URL is empty string', async () => {
        const target = '';
        const userId = 'user123';

        try {
            await createUrl(target, userId);
        } catch (error) {
            expect(error.message).toContain('Please provide URL.');
        }
    });
});

describe('updateUrl', () => {
    it('should update URL with custom short ID', async () => {
        const urlId = 'url123';
        const customShort = 'custom123';
        const userId = 'user123';
        const mockUpdatedUrl = { _id: urlId, short: customShort };
        Url.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedUrl);

        const result = await updateUrl(urlId, customShort, userId);

        expect(Url.findOneAndUpdate).toHaveBeenCalledWith({ _id: urlId, createdBy: userId }, { short: customShort.trim() }, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdatedUrl);
    });

    it('should throw NotFoundError if URL to update is not found', async () => {
        const urlId = 'nonexistent';
        const customShort = 'custom123';
        const userId = 'user123';
        Url.findOneAndUpdate.mockResolvedValueOnce(null);

        await expect(updateUrl(urlId, customShort, userId)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if custom short ID is already in use', async () => {
        const urlId = 'url123';
        const customShort = 'custom123';
        const userId = 'user123';
        Url.findOneAndUpdate.mockRejectedValueOnce({ code: 11000 });

        await expect(updateUrl(urlId, customShort, userId)).rejects.toThrow(BadRequestError);
    });
});

describe('deleteUrl', () => {
    it('should delete URL by ID', async () => {
        const urlId = 'url123';
        const userId = 'user123';
        const mockDeletedUrl = { _id: urlId };
        Url.findOneAndDelete.mockResolvedValueOnce(mockDeletedUrl);

        const result = await deleteUrl(urlId, userId);

        expect(Url.findOneAndDelete).toHaveBeenCalledWith({ _id: urlId, createdBy: userId });
        expect(result).toEqual(mockDeletedUrl);
    });

    it('should throw NotFoundError if URL to delete is not found', async () => {
        const urlId = 'nonexistent';
        const userId = 'user123';
        Url.findOneAndDelete.mockResolvedValueOnce(null);

        await expect(deleteUrl(urlId, userId)).rejects.toThrow(NotFoundError);
    });
});
