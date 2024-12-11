import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stages'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('numero').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}