const express = require('express');
const routes = require('./src/routes');
const cors = require('cors');
const app = express();
const port = 3333;
const { errors } = require('celebrate');

app.use(express.json());
app.use(cors());

app.use(routes);
app.use(errors());

app.listen(port, () => console.log(`Server is running on port ${port}`));