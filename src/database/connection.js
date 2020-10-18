
const path = require('path');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'us-cdbr-east-02.cleardb.com',
    user : 'b61f1f184e14b2',
    password : 'ca43e180',
    database : 'heroku_889f2ad10665e39'
  },
  useNullAsDefault: true
});
module.exports = knex;