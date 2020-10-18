
exports.up = async (knex) => {
    return knex.schema.createTable('historic', table => {
        table.increments('id').primary().unique();
        table.string('nome_cliente',255).notNullable();
        table.string('localidade',255).notNullable();
        table.string('code', 255).notNullable();
        table.string('date', 255).notNullable();
        table.string('produto', 255).notNullable();
    });
}

exports.down = async (knex) => {
    return knex.schema.dropTable('historic');
}