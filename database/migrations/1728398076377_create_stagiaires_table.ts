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
      table.string('nom_complet_pere').notNullable()
      table.string('nom_complet_mere').notNullable()
      table.string('sexe').notNullable()
      table.string('nationalite').notNullable()
      table.string('situation_matrimoniale').notNullable()
      table.string('telephone').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('lieu_residence').notNullable()
      table.string('photo').nullable()
      table.string('numero_piece').nullable()
      table.string('nom_complet_garant').nullable()
      table.string('lien_avec_stagiaire').nullable()
      table.string('telephone_garant').nullable()
      table.string('competence_professionnelle').nullable()
      table.string('statut').nullable()
      table.string('numero_badge').nullable()
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