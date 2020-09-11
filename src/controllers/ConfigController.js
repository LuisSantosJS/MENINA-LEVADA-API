const knex = require('../database/connection');
const fs = require('fs');
const moment = require('moment')

const path = require('path');
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
    },
    async indexHistoric(request, response) {
        knex('historic').select('*').orderBy('id', 'desc').then((res) => {
            return response.json({ message: 'success', res: res })
        }).catch((err) => {
            return response.json({ message: 'error' })
        })
    },
    async createHistoric(request, response) {
        const {
            nome_cliente,
            localidade,
            code,
            produto
        } = request.body;
        if (nome_cliente == null) {
            return response.json({ message: 'error', res: 'falta o nome_cliente' })
        }
        if (code == null) {
            return response.json({ message: 'error', res: 'falta a code' })
        }
        if (localidade == null) {
            return response.json({ message: 'error', res: 'falta a localidade' })
        }
        if (produto == null) {
            return response.json({ message: 'error', res: 'falta o  produto' })
        }

        knex('historic').insert([{
            nome_cliente,
            localidade,
            code,
            date: moment(new Date()).format('L'),
            produto
        }]).then(() => {
            return response.json({ message: 'success' })
        }).catch(res => {
            return response.json({ message: 'error' })
        })
    },
    async deleteHistoric(request, response) {
        const io = request.app.io;
        const { code } = request.body;
        if (code == null) {
            return response.json({ message: 'error', res: 'falta o id' })
        }

        fs.unlinkSync(path.resolve(__dirname, '..', 'documents', `${code}.pdf`))
        knex('historic').where('code', code).delete().then(() => {
            knex('historic').select('*').then((res) => {
                io.emit('historic', res);
                return response.json({ message: 'success' })
            }).catch(() => {
                return response.json({ message: 'error' })
            })
        }).catch(() => {
            return response.json({ message: 'error' })
        })
    }


}

module.exports = ConfigController;