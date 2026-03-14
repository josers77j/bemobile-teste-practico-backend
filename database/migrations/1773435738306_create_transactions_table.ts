import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTransactionsTable extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('RESTRICT')
      table
        .integer('gateway_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('gateways')
        .onDelete('RESTRICT')
      table.string('external_id', 255).notNullable()
      table
        .enum('status', ['pending', 'paid', 'refunded', 'failed'])
        .notNullable()
        .defaultTo('pending')
      table.integer('amount').unsigned().notNullable()
      table.string('card_last_numbers', 4).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
