exports.seed = function (knex) {
    return knex('config').insert([{
        origin: 69921325,
        addition_price: 0,
        addition_days: 0,
        company_name: 'Menina Levada'
    }])
}