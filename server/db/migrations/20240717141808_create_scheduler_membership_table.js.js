module.exports.up = (knex) =>
  knex.schema.createTable('scheduler_membership', (table) => {
    /* Columns */

    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));

    table.bigInteger('scheduler_id').notNullable();
    table.bigInteger('user_id').notNullable();
    table.text('role').notNullable().defaultTo('editor');
    table.boolean('can_comment');

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    /* Indexes */

    table.unique(['scheduler_id', 'user_id']);
    table.index('user_id');
  });

module.exports.down = (knex) => knex.schema.dropTable('scheduler_membership');
