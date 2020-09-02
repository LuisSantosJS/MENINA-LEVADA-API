
exports.up = async (knex) => {
    return knex.schema.createTable('config', table => {
        table.increments('id').primary().unique();
        table.float('origin', 8, 2).notNullable();
        table.float('addition_price', 8, 2).notNullable();
        table.float('addition_days', 8, 2).notNullable();
        table.string('company_name', 255).notNullable();
    });
}

exports.down = async (knex) => {
    return knex.schema.dropTable('config');
}