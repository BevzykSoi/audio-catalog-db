const express = require('express');
const audioController = require('../controllers/audioController');

const router = express.Router();

router.get('/', audioController.getAll);
router.post('/', audioController.create);
router.get('/:id', audioController.getById);
router.put('/:id', audioController.update);
router.delete('/:id', audioController.delete);
router.patch('/:contactId/favorite', audioController.favorite);
module.exports = router;