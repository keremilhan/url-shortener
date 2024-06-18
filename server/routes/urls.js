const express = require('express');
const router = express.Router();
const { getAllUrlsController, getUrlController, createUrlController, updateUrlController, deleteUrlController } = require('../controllers/urlController');

const authenticateUser = require('../middleware/authentication');
const headerExtractMiddleware = require('../middleware/headerExtract');

router.route('/').post(headerExtractMiddleware, createUrlController);
router.route('/get').post(authenticateUser, getAllUrlsController);
router.route('/:id').get(getUrlController).patch(authenticateUser, updateUrlController).delete(authenticateUser, deleteUrlController);

module.exports = router;
