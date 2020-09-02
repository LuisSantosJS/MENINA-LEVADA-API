
exports.up = async (knex) => {
    return knex.schema.createTable('historic', table => {
        table.increments('id').primary().unique();
        table.float('origem', 8,2).notNullable();
        table.float('destino',8,2).notNullable();
        table.float('nome_cliente',8,2).notNullable();
        table.string('cidade',8,2).notNullable();
        table.string('estado',8,2).notNullable();
        table.string('peso', 100).notNullable();
        table.string('formato', 100).notNullable();
        table.string('comprimento', 100).notNullable();
        table.string('altura', 100).notNullable();
        table.string('largura', 100).notNullable();
        table.string('servico', 100).notNullable();
        table.string('diametro', 100).notNullable();
        table.string('uri', 255).notNullable();
    });
}

exports.down = async (knex) => {
    return knex.schema.dropTable('historic');
}