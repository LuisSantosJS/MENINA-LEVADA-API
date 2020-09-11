

exports.seed = function (knex) {
    return knex('admin').insert([
        {
            email: 'meninalevada.deploy@gmail.com',
            password:'$2a$10$U.aqEJiusGPN1mhX7Cg6i.MAF1b4dbxeOrLzmCeyZ3ukbexpUtUKu',
            disabled: false
        }
    ])
}