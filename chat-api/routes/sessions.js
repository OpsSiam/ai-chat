const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  deleteSession,
  renameSession, 
} = require('../controllers/sessionController');

router.post('/', createSession); 
router.get('/', getSessions); 
router.delete('/:sessionId', deleteSession); 
router.put('/:id', renameSession); 

module.exports = router;
