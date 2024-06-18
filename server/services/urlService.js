const Url = require('../models/Url');
const { NotFoundError, BadRequestError } = require('../errors');
const { formatUrl, isValidUrl, generateUniqueId } = require('../utils/utils');

/**
 * Retrieves all URLs created by a specific user.
 *
 * @param {string} userId - The ID of the user whose URLs are to be retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of URLs created by the user.
 */
const getAllUrls = async userId => {
    return await Url.find({ createdBy: userId });
};

/**
 * Retrieves a URL by its short identifier (short URL).
 * Increases the click count of the URL and saves the updated URL.
 * Throws a NotFoundError if the URL with the provided short identifier does not exist.
 *
 * @param {string} urlId - The short identifier (short URL) of the URL to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the retrieved URL object.
 * @throws {NotFoundError} If no URL is found with the provided short identifier.
 */
const getUrlById = async urlId => {
    const url = await Url.findOne({ short: urlId });
    if (!url) {
        throw new NotFoundError(`No such URL: ${urlId}`);
    }
    url.clicks++;
    await url.save();
    return url;
};

/**
 * Tries to create a new URL entry with a unique short identifier (short URL).
 * Retries up to a maximum number of attempts if a unique short URL cannot be generated due to collisions.
 *
 * @param {string} target - The target URL to shorten and save.
 * @param {string} userId - The ID of the user creating the URL.
 * @param {number} [attempt=0] - Current attempt number (default is 0).
 * @param {number} [maxAttempts=5] - Maximum number of attempts to generate a unique short URL (default is 5).
 * @returns {Promise<Object>} A promise that resolves to the created URL object.
 * @throws {Error} If the maximum number of attempts is reached without generating a unique short URL.
 */
const tryCreateUrl = async (target, userId, attempt = 0, maxAttempts = 5) => {
    if (attempt >= maxAttempts) {
        throw new Error('Max attempts reached, could not generate unique short URL');
    }

    const uniqueId = generateUniqueId();

    const newUrl = new Url({
        target,
        short: uniqueId,
        createdBy: userId,
    });

    try {
        await newUrl.save();
        return newUrl;
    } catch (error) {
        if (error.code === 11000) {
            return tryCreateUrl(target, userId, attempt + 1, maxAttempts);
        }
        throw error;
    }
};

const createUrl = async (target, userId) => {
    if (!target) {
        throw new Error('Please provide URL.');
    }
    target = formatUrl(target.trim());
    if (!isValidUrl(target)) {
        throw new Error('Invalid URL.');
    }

    return await tryCreateUrl(target, userId);
};

/**
 * Updates the short identifier (short URL) of a URL entry owned by a specific user.
 * Throws a NotFoundError if no URL is found with the provided URL ID and user ID combination.
 * Throws a BadRequestError if the custom short URL is already in use.
 *
 * @param {string} urlId - The ID of the URL to update.
 * @param {string} customShort - The custom short URL to assign to the URL entry.
 * @param {string} userId - The ID of the user who owns the URL.
 * @returns {Promise<Object>} A promise that resolves to the updated URL object.
 * @throws {NotFoundError} If no URL is found with the provided URL ID and user ID combination.
 * @throws {BadRequestError} If the custom short URL is already in use.
 */
const updateUrl = async (urlId, customShort, userId) => {
    try {
        const updatedUrl = await Url.findOneAndUpdate({ _id: urlId, createdBy: userId }, { short: customShort.trim() }, { new: true, runValidators: true });
        if (!updatedUrl) {
            throw new NotFoundError(`No such URL: ${urlId}`);
        }
        return updatedUrl;
    } catch (error) {
        if (error.code === 11000) {
            throw new BadRequestError('Custom short URL already in use.');
        }
        throw error;
    }
};

const deleteUrl = async (urlId, userId) => {
    const url = await Url.findOneAndDelete({ _id: urlId, createdBy: userId });

    if (!url) {
        throw new NotFoundError(`No such URL: ${urlId}`);
    }

    return url;
};

module.exports = {
    getAllUrls,
    getUrlById,
    createUrl,
    updateUrl,
    deleteUrl,
    tryCreateUrl,
};
