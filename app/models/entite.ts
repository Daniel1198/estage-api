import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Responsable from './responsable.js'

export default class Entite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare intitule: string

  @column()
  declare type: string

  @column()
  declare entiteId: number | null

  @belongsTo(() => Entite)
  declare parent: BelongsTo<typeof Entite>

  @hasMany(() => Entite)
  declare sousEntites: HasMany<typeof Entite>

  @hasMany(() => Responsable)
  declare responsables: HasMany<typeof Responsable>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}