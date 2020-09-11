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
        knex('admin').where('email', String(email).toLowerCase()).select('*').then(res => {
            if (res.length === 0) {
                return response.json({ message: 'error', res: 'Usuário não cadastrado e sem privilégios de administrador' })
            }
            const hash = res[0].password;
            const mail = res[0].email;
            const ID = res[0].id;
            const disabled = res[0].disabled;
            const value = bcrypt.compareSync(String(password), String(hash));
            if (!value) {
                return response.json({ message: 'error', res: 'Senha incorreta!' })
            }
            if (mail !== String(email).toLowerCase()) {
                return response.json({ message: 'error', res: 'Usuário não cadastrado e sem privilégios de administrador' })
            }
            return response.json({
                message: 'success', res: 'Login realizado!', data: {
                    id: ID,
                    disabled: disabled
                }
            })

        })
    },
    async update(request, response) {
        const { password, email } = request.body;
        if (password == null) {
            return response.json({ message: 'error', res: 'Preencha o campo senha' })
        }
        if (email == null) {
            return response.json({ message: 'error', res: 'Preencha o campo email' })
        }
        const hash = bcrypt.hashSync(String(password), 10);
        knex('admin').where('email', String(email).toLowerCase()).update({
            password: hash
        }).then(() => {
            return response.json({ message: 'success' })
        }).catch(res => {
            return response.json({ message: 'error', res: res })
        })
    },
    async updateStatus(request, response) {
        const io = request.app.io;
        const { status, id } = request.body;
        if (status == null) {
            return response.json({ message: 'error', res: 'Falta o status' })
        }
        if (id == null) {
            return response.json({ message: 'error', res: 'Falta o id' })
        }
        knex('admin').where('id', id).update({
            disabled: Boolean(status)
        }).then(() => {
            knex('admin').select('admin.id', 'admin.email', 'admin.disabled').orderBy('id', 'desc').then(res=>{
                io.emit('users', res)
            })
            return response.json({ message: 'success' })
        }).catch(res => {
            return response.json({ message: 'error', res: res })
        })
    },
    async create(request, response) {
        const io = request.app.io;
        const { email, password } = request.body;
        if (password == null) {
            return response.json({ message: 'error', res: 'Preencha o campo senha' })
        }
        if (email == null) {
            return response.json({ message: 'error', res: 'Preencha o campo email' })
        }
        const hash = bcrypt.hashSync(String(password), 10);
        const isUser = await knex('admin').where('email', String(email).toLowerCase()).select('*');
        if(isUser.length !== 0){
            return response.json({ message: 'error' , res: 'Usuário Existente'})
        }
        knex('admin').insert({
            email: String(email).toLowerCase(),
            password: hash,
            disabled: false
        }).then(() => {
            knex('admin').select('admin.id', 'admin.email', 'admin.disabled').orderBy('id', 'desc').then(res=>{
                io.emit('users', res)
            })
            return response.json({ message: 'success' })
        }).catch(() => {
            return response.json({ message: 'error', res: 'Ocorreu um erro!' })
        })

    },
    async index(request, response) {
        knex('admin').select('admin.id', 'admin.email', 'admin.disabled').orderBy('id', 'desc').then(res => {
            return response.json({ message: 'success', res: res })
        }).catch(() => {
            return response.json({ message: 'error' })
        })
    },
    async unique(request, response) {
        const { id } = request.query;
        if(id == null){
            return response.json({ message: 'error', res: 'Falta o ID' })
        }
        knex('admin').where('id', id).select('admin.disabled').then(res => {
            return response.json({ message: 'success', res: res[0].disabled })
        }).catch(() => {
            return response.json({ message: 'error' })
        })
    }
}

module.exports = AdminController;