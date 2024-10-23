const express = require('express');
const router = express.Router();
const {
    chatHandler,
    getMessages,
  } = require('../controllers/chatController');
const { body, validationResult } = require('express-validator');

router.post(
  '/',
  [
    body('messages').isArray().withMessage('Messages must be an array'),
      ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  chatHandler
);

router.get('/:sessionId/messages', getMessages);

module.exports = router;
