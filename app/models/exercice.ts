import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Stage from './stage.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Exercice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare active: boolean

  @column()
  declare debut: Date

  @column()
  declare fin: Date

  @hasMany(() => Stage)
  declare stages: HasMany<typeof Stage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}