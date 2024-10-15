import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Exercice from './exercice.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Stagiaire from './stagiaire.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Entite from './entite.js'
import Responsable from './responsable.js'

export default class Stage extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare type: string

  @column()
  declare debut: Date

  @column()
  declare fin: Date

  @column()
  declare statut: string

  @column()
  declare exerciceId: number

  @belongsTo(() => Exercice)
  declare exercice: BelongsTo<typeof Exercice>

  @column()
  declare stagiaireId: number

  @belongsTo(() => Stagiaire)
  declare stagiaire: BelongsTo<typeof Stagiaire>

  @column()
  declare entiteId: number | null

  @belongsTo(() => Entite)
  declare entite: BelongsTo<typeof Entite>

  @column()
  declare responsableId: number | null

  @belongsTo(() => Responsable)
  declare responsable: BelongsTo<typeof Responsable>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}