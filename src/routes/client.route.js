const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const ClientController = require('../controllers/client.controller');
const clientController = new ClientController();

router.post('/', authMiddleware, clientController.createClient);
router.post('/bulk', authMiddleware, clientController.createClientBulk);

router.get('/', authMiddleware, clientController.getClients);

router.patch('/:clientId', authMiddleware, clientController.editClientInfo);
router.delete('/:clientId', authMiddleware, clientController.deleteClient);

router.get('/lists', authMiddleware, clientController.getCreatedClientsById);

module.exports = router;
