const express = require('express');
const router = express.Router();
const conversationController  = require('../controllers/conversationController');
const auth = require('../middleware/auth');

router.get('/', auth, conversationController.getUserConversations);
router.get('/:id/messages', auth, conversationController.getConversationMessages);
router.post('/', auth, conversationController.createConversation);

module.exports = router;

