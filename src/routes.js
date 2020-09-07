const express = require('express');
const AdminController = require('./controllers/AdminController');
const ConfigController = require('./controllers/ConfigController');
const CorreiosController = require('./controllers/CorreiosController');
const routes = express.Router();

routes.post('/admin/login', AdminController.login);
routes.post('/admin/update', AdminController.update);

routes.get('/config', ConfigController.index);
routes.post('/config/update', ConfigController.update);

routes.post('/calc', CorreiosController.index)
routes.post('/rast', CorreiosController.rast)
routes.post('/rast/certificado', CorreiosController.pdf);
routes.get('/download/certificado', CorreiosController.download);


module.exports = routes;