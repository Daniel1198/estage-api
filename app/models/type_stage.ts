import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TypeStage extends BaseModel {
  public static table = 'types_stage'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare intitule: string

  @column()
  declare duree: number
}