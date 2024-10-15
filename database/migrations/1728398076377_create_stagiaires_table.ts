import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stagiaires'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('matricule').unique().notNullable()
      table.string('nom').notNullable()
      table.string('prenom').notNullable()
      table.date('date_naissance').notNullable()
      table.string('genre').notNullable()
      table.string('nationalite').notNullable()
      table.string('situation_matrimoniale').notNullable()
      table.string('telephone').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('commune_quartier').notNullable()
      table.string('photo').nullable()
      table.string('lettre_motivation').nullable()
      table.string('cv').nullable()
      table.string('nom_complet_garant').nullable()
      table.string('lien_avec_stagiaire').nullable()
      table.string('telephone_garant').nullable()
      table.string('etablissement').nullable()
      table.string('niveau').nullable()
      table.string('qualification').nullable()
      table.string('statut').nullable()
      table.integer('user_id').unsigned().references('users.id').onUpdate('CASCADE').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}