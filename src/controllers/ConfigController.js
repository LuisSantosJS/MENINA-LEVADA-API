const knex = require('../database/connection');
const ConfigController = {
    async index(request, response) {
        knex('config').where('id', 1).select('*').then(res => {
            return response.json({ message: 'success', res: res })
        }).catch((res) => {
            return response.json({ message: 'error', res: res })
        })
    },
    async origin(request, response) {

    },
    async price(request, response) {

    },
    async days(request, response) {

    }
}

module.exports = ConfigController;