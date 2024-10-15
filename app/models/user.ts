import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import Notification from './notification.js'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { MultipartFile } from '@adonisjs/core/bodyparser'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['code'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare fullName: string

  @column()
  declare job: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare image: MultipartFile | null | string

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @column.dateTime()
  declare connectedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @manyToMany(() => Permission, {
    pivotTable: 'user_permissions'
  })
  declare permissions: ManyToMany<typeof Permission>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}