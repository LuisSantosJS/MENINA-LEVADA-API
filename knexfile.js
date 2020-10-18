const path = require('path');

module.exports = {
    client: 'mysql',
    connection: {
      host : 'us-cdbr-east-02.cleardb.com',
      user : 'b61f1f184e14b2',
      password : 'ca43e180',
      database : 'heroku_889f2ad10665e39'
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },

    useNullAsDefault: true
};

