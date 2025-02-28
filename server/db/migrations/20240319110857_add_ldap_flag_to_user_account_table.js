module.exports.up = (knex) =>
  knex.schema.table('user_account', (table) => {
    /* Columns */

    table.boolean('is_ldap').notNullable().default(false);
  });

module.exports.down = (knex) =>
  knex.schema.table('user_account', (table) => {
    table.dropColumn('is_ldap');
  });
