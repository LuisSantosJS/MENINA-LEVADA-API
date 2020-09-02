const express = require('express');
const AdminController = require('./controllers/AdminController');
const ConfigController = require('./controllers/ConfigController');
const routes = express.Router();

routes.post('/admin/login', AdminController.login);
routes.post('/admin/update', AdminController.update);

routes.post('/config/update/origin',ConfigController.origin);
routes.post('/config/update/days', ConfigController.days);
routes.post('/config/update/pricing', ConfigController.price);

module.exports = routes;