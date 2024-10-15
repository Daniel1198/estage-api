import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Stage from './stage.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import Entite from './entite.js'

export default class Responsable extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column()
  declare fonction: string

  @column()
  declare poste: string | null

  @column()
  declare email: string

  @column()
  declare telephone: string | null

  @column()
  declare estDirecteur: boolean

  @column()
  declare entiteId: number

  @belongsTo(() => Entite)
  declare entite: BelongsTo<typeof Entite>

  @hasMany(() => Stage)
  declare stages: HasMany<typeof Stage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}