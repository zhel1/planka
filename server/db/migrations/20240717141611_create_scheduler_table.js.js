module.exports.up = (knex) =>
  knex.schema.createTable('scheduler', (table) => {
    /* Columns */

    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));

    table.text('name').notNullable();
    table.jsonb('background');
    table.jsonb('background_image');

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);
  });

module.exports.down = (knex) => knex.schema.dropTable('scheduler');
