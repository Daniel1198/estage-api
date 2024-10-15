import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'responsables'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').unique().notNullable()
      table.string('nom').notNullable()
      table.string('prenom').notNullable()
      table.string('fonction').nullable()
      table.string('poste').nullable()
      table.string('email').unique().nullable()
      table.string('telephone').unique().nullable()
      table.boolean('est_directeur').defaultTo(false)
      table.integer('entite_id').unsigned().references('entites.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}