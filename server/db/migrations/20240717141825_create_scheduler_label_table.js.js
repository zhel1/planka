module.exports.up = (knex) =>
  knex.schema.createTable('scheduler_label', (table) => {
    /* Columns */

    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));

    table.bigInteger('scheduler_id').notNullable();

    table.text('name');
    table.text('color').notNullable();
    table.specificType('position', 'double precision').notNullable();

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    /* Indexes */

    table.index('scheduler_id');
    table.index('position');
  });

module.exports.down = (knex) => knex.schema.dropTable('scheduler_label');
