import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').unique().notNullable()
      table.string('type').notNullable()
      table.date('debut').notNullable()
      table.date('fin').notNullable()
      table.boolean('renouvellement').defaultTo(false)
      table.string('statut').nullable()
      table.integer('exercice_id').unsigned().references('exercices.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('stagiaire_id').unsigned().references('stagiaires.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('responsable_id').unsigned().references('responsables.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('entite_id').unsigned().references('entites.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('type_stage_id').unsigned().references('types_stage.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}