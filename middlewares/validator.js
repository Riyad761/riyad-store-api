/**
 * Input Validation Middleware for Riyad Store API using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return errorResponse(res, 400, 'Validation failed for request parameters', formattedErrors);
  }
  next();
};

const validateUpload = [
  body('name')
    .notEmpty()
    .withMessage('Command name is required')
    .isString()
    .withMessage('Command name must be a string')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('version')
    .optional()
    .isString()
    .trim()
    .matches(/^\d+\.\d+\.\d+$/)
    .withMessage('Version must follow semver format e.g. 1.0.0'),
  body('author')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Author name cannot exceed 50 characters'),
  body('category')
    .optional()
    .isString()
    .trim(),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('rawCode')
    .notEmpty()
    .withMessage('rawCode (JavaScript code) is required')
    .isString()
    .withMessage('rawCode must be a text string'),
  handleValidationErrors,
];

const validateUpdate = [
  param('id').notEmpty().withMessage('Command ID parameter is required'),
  body('name').optional().isString().trim().isLength({ min: 2, max: 60 }),
  body('version').optional().isString().trim(),
  body('author').optional().isString().trim(),
  body('category').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('rawCode').optional().isString(),
  handleValidationErrors,
];

const validateIdParam = [
  param('id').notEmpty().withMessage('Command ID parameter is required'),
  handleValidationErrors,
];

module.exports = {
  validateUpload,
  validateUpdate,
  validateIdParam,
};
