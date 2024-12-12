import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stagiaires'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('info_sur_note').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}