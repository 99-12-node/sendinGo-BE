const express = require('express');
const router = express.Router();

const ClientController = require('../controllers/client.controller');
const clientController = new ClientController();

router.post('/', clientController.createClient);
router.post('/bulk', clientController.createClientBulk);
router.get('/', clientController.getAllClient);
router.patch('/:clientId', clientController.editClientInfo);
router.delete('/:clientId', clientController.deleteClient);

module.exports = router;
