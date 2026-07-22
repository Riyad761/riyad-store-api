/**
 * Store API Express Router for Riyad Store API
 */

const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { validateUpload, validateUpdate, validateIdParam } = require('../middlewares/validator');
const { actionLimiter } = require('../middlewares/rateLimiter');

// GET List all commands with optional pagination and filters
router.get('/list', storeController.getList);

// GET Search commands by query ?q=
router.get('/search', storeController.search);

// GET Get distinct categories
router.get('/categories', storeController.getCategories);

// GET Get command details by numeric or Mongo ID
router.get('/info/:id', validateIdParam, storeController.getInfo);

// GET Get raw JavaScript code output for bot execution
router.get('/raw/:id', validateIdParam, storeController.getRawCode);

// POST Upload new command plugin
router.post('/upload', actionLimiter, validateUpload, storeController.upload);

// PUT Update command plugin details or code
router.put('/update/:id', actionLimiter, validateUpdate, storeController.update);

// DELETE Remove command plugin
router.delete('/delete/:id', actionLimiter, validateIdParam, storeController.delete);

// POST Like command plugin
router.post('/like/:id', actionLimiter, validateIdParam, storeController.like);

// POST Download counter increment
router.post('/download/:id', actionLimiter, validateIdParam, storeController.download);

module.exports = router;
