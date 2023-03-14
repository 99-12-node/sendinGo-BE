const express = require('express');
const router = express.Router();

const ClientController = require('../controllers/client.controller');
const clientController = new ClientController();

router.post('/', clientController.createClient);
router.get('/', clientController.getAllClient);
router.delete('/:clientId', clientController.deleteClient);

module.exports = router;
