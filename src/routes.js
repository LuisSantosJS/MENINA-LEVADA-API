const express = require('express');
const AdminController = require('./controllers/AdminController');
const ConfigController = require('./controllers/ConfigController');
const CorreiosController = require('./controllers/CorreiosController');
const routes = express.Router();

routes.post('/admin/login', AdminController.login);
routes.post('/admin/update', AdminController.update);
routes.post('/admin/create', AdminController.create);
routes.post('/admin/delete', AdminController.create);
routes.get('/admin', AdminController.index);
routes.post('/admin/status', AdminController.updateStatus);
routes.get('/admin/unique', AdminController.unique);

routes.get('/historic/index', ConfigController.indexHistoric);
routes.post('/historic/create', ConfigController.createHistoric);
routes.post('/historic/delete', ConfigController.deleteHistoric);

routes.get('/config', ConfigController.index);
routes.post('/config/update', ConfigController.update);

routes.post('/calc', CorreiosController.index)
routes.post('/rast', CorreiosController.rast)
routes.post('/rast/certificado', CorreiosController.pdf);
routes.get('/download/certificado/:id', CorreiosController.download);



module.exports = routes;