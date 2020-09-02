const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const AdminController = {
    async login(request, response) {
        const { email, password } = request.body;
        if (email == null) {
            return response.json({ message: 'error', res: 'Preencha o campo email' })
        }
        if (password == null) {
            return response.json({ message: 'error', res: 'Preencha o campo senha' })
        }
        knex('admin').where('id', 1).select('admin.password').then(res => {
            const hash = res[0].password;
            const value = bcrypt.compareSync(String(password), String(hash));
            if (value) {
                return response.json({ message: 'success', res: 'Login realizado!' })
            }
            return response.json({ message: 'error', res: 'Senha incorreta!' })

        })
    },
    async update(request, response) {
        const { password } = request.body;
        if (password == null) {
            return response.json({ message: 'error', res: 'Preencha o campo senha' })
        }
        const hash = bcrypt.hashSync(String(password), 10);
        knex('admin').where('id', 1).update({
            password: hash
        }).then(() => {
            return response.json({ message: 'success' })
        }).catch(res => {
            return response.json({ message: 'error', res: res })
        })
    }
}

module.exports = AdminController;