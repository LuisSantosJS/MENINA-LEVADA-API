const express = require('express');
const routes = require('./src/routes');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res)=> res.json({message: 'API FUNCIONANDO'}))

app.use(routes);

app.listen(port, () => console.log(`Server is running on port ${port}`));