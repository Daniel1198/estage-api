import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titre: string

  @column()
  declare message: string

  @column.dateTime({ autoCreate: true })
  declare dispatchAt: DateTime

  @column.dateTime()
  declare readingAt: DateTime | null
}