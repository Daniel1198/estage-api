import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'modeles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('intitule').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}