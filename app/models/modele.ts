import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'

export default class Modele extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare intitule: string

  @manyToMany(() => Permission, {
    pivotTable: 'modele_permissions'
  })
  declare permissions: ManyToMany<typeof Permission>
}