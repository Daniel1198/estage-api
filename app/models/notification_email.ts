import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NotificationEmail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string
}