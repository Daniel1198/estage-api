import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Stage from './stage.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/bodyparser'

export default class Stagiaire extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare matricule: string

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column()
  declare dateNaissance: Date

  @column()
  declare genre: string

  @column()
  declare nationalite: string

  @column()
  declare situationMatrimoniale: string

  @column()
  declare telephone: string

  @column()
  declare email: string

  @column()
  declare communeQuartier: string

  @column()
  declare photo: MultipartFile | null | string

  @column()
  declare lettreMotivation: MultipartFile | null | string

  @column()
  declare cv: MultipartFile | null | string

  @column()
  declare nomCompletGarant: string | null

  @column()
  declare lienAvecStagiaire: string | null

  @column()
  declare telephoneGarant: string | null

  @column()
  declare etablissement: string | null

  @column()
  declare niveau: string | null

  @column()
  declare qualification: string | null

  @column()
  declare statut: string | null

  @column()
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Stage)
  declare stages: HasMany<typeof Stage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}