const express = require('express');

const router = express.Router();

const playlistController = require('../controllers/playlistController');
const { auth, schemaValidate } = require('../middlewares/index');
const playlistValidator = require('../validationSchemas/playlist.validator');

router.post(
    '/',
    schemaValidate(playlistValidator.create),
    auth,
    playlistController.create
);
router.get('/', playlistController.getAll);
router.get('/:id', playlistController.getById);
router.put('/:id', auth, playlistController.update);
router.delete('/:id', auth, playlistController.delete);

module.exports = router;