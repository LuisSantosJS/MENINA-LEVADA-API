const express = require('express');
const routes = require('./src/routes');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8877;
const http = require('http');
const IO = require('socket.io');

app.use(express.json());
app.use(cors());
const server = http.createServer(app)
const io = IO.listen(server);

io.on("connection", socket => {

});
app.io = io;
app.get('/', (req, res) => res.json({ message: 'API FUNCIONANDO' }));
app.use(routes);
app.use(function(req,res,next){
    req.io = io;
    next();
});

server.listen(port, () => console.log(`Server is running on port ${port}`));