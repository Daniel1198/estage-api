import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'types_stage'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('intitule').notNullable()
      table.integer('duree').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}