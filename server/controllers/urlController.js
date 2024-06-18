const { StatusCodes } = require('http-status-codes');
const { getAllUrls, getUrlById, createUrl, updateUrl, deleteUrl } = require('../services/urlService');

const getAllUrlsController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const urls = await getAllUrls(userId);
        res.status(StatusCodes.OK).json({ urls });
    } catch (error) {
        next(error);
    }
};

const getUrlController = async (req, res, next) => {
    try {
        const urlId = req.params.id;
        const url = await getUrlById(urlId);
        res.redirect(url.target);
    } catch (error) {
        next(error);
    }
};

const createUrlController = async (req, res, next) => {
    try {
        const { target } = req.body;
        const userId = req.user ? req.user.userId : null;
        const url = await createUrl(target, userId);
        res.status(StatusCodes.CREATED).json({ url, message: 'New short URL created successfully' });
    } catch (error) {
        next(error);
    }
};

const updateUrlController = async (req, res, next) => {
    try {
        const urlId = req.params.id;
        const { customShort } = req.body;
        const userId = req.user.userId;
        const url = await updateUrl(urlId, customShort, userId);
        res.status(StatusCodes.OK).json({ url, message: 'URL updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteUrlController = async (req, res, next) => {
    try {
        const urlId = req.params.id;
        const userId = req.user.userId;
        await deleteUrl(urlId, userId);
        res.status(StatusCodes.OK).json({ message: 'URL deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUrlsController,
    getUrlController,
    createUrlController,
    updateUrlController,
    deleteUrlController,
};
