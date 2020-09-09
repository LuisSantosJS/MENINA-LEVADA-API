const express = require('express');
const routes = require('./src/routes');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8877;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.json({ message: 'API FUNCIONANDO' }));

app.use(routes);

app.listen(port, () => console.log(`Server is running on port ${port}`));