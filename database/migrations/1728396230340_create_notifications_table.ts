import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titre').notNullable()
      table.text('message').notNullable()
      table.integer('user_id').unsigned().references('users.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('dispatch_at')
      table.timestamp('reading_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}