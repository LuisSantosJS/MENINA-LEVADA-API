

exports.seed = function (knex) {
    return knex('admin').insert([
        {
            email: 'admin@admin.com',
            password:'SAIDESSA'
        }
    ])
}