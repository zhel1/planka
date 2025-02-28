module.exports.up = (knex) =>
  knex.schema.createTable('scheduler_event', async (table) => {
    /* Columns */

    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));

    table.bigInteger('scheduler_id').notNullable();
    table.bigInteger('creator_user_id').notNullable();
    table.bigInteger('scheduler_label_id').notNullable();

    table.text('name').notNullable();
    table.text('description');
    table.timestamp('start_date', true);
    table.timestamp('until_date', true);
    table.boolean('is_all_day');
    table.integer('duration').notNullable();
    table.boolean('is_recurring');
    table.text('recurrence_pattern');

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    /* Indexes */

    table.index('scheduler_id');
  });

module.exports.down = (knex) => knex.schema.dropTable('card');
