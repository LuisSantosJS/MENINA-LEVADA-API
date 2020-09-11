
exports.up = async (knex) => {
    return knex.schema.createTable('admin', table => {
        table.increments('id').primary().unique();
        table.string('email', 255).notNullable();
        table.string('password',255).notNullable();
        table.boolean('disabled').notNullable();
    });
}

exports.down = async (knex) => {
    return knex.schema.dropTable('admin');
}