
exports.up = async (knex) => {
    return knex.schema.createTable('config', table => {
        table.increments('id').primary().unique();
        table.string('origin', 200).notNullable();
        table.string('addition_price', 200).notNullable();
        table.string('addition_days', 200).notNullable();
        table.string('company_name', 255).notNullable();
    });
}

exports.down = async (knex) => {
    return knex.schema.dropTable('config');
}