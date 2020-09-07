const knex = require('../database/connection');
const ConfigController = {
    async index(request, response) {
        knex('config').where('id', 1).select('*').then(res => {
            return response.json({ message: 'success', res: res })
        }).catch((res) => {
            return response.json({ message: 'error', res: res })
        })
    },
    async update(request, response) {
        const {
            origin,
            addition_price,
            addition_days
        } = request.body;
        if (origin == null) {
            return response.json({ message: 'error', res: 'falta o CEP de origem' })
        }
        if (addition_price == null) {
            return response.json({ message: 'error', res: 'falta o preço adicional' })
        }
        if (addition_days == null) {
            return response.json({ message: 'error', res: 'falta os dias adicionais' })
        }
        knex('config').where('id', 1).update({
            origin,
            addition_price,
            addition_days
        }).then(() => {
            return response.json({ message: 'success' })
        }).catch((res) => {
            return response.json({ message: 'error', res: res })
        })
    }

}

module.exports = ConfigController;