const express = require('express');
const matchsController = require('../controllers/matchs.controller');

const router = express.Router();

// Définir les routes des matchs
router.post('/', matchsController.createMatch);
router.get('/:id', matchsController.getMatch);
router.get('/', matchsController.getAllMatchs);
router.put('/:id', matchsController.updateMatch);
router.delete('/:id', matchsController.deleteMatch);
//to 
module.exports = router;
