const express = require('express');
const routes = require('./src/routes');
const http = require('http');
const cors = require('cors');
const users = {};
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.get('/online', (req, res) => {
    return res.json({ numbers: Object.keys(users).length})
})

app.use(routes);

const server = http.createServer(app);

const io = require('socket.io')(server);

io.on('connection', (client) => {
    client.on('login', function(data) {
        users[client.id] = String(data.IP);
        io.emit('online', Object.keys(users).length)
    });
    client.on('disconnect', function() {
        delete users[client.id];
        io.emit('online', Object.keys(users).length)
    });
});




server.listen(port, () => console.log(`Server is running on port ${port}`));