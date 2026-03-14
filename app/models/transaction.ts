import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Gateway from '#models/gateway'
import TransactionProduct from '#models/transaction_product'
import { TransactionSchema } from '#database/schema'

export default class Transaction extends TransactionSchema {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare gatewayId: number

  @column()
  declare externalId: string

  @column()
  declare status: 'pending' | 'paid' | 'refunded' | 'failed'

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @hasMany(() => TransactionProduct)
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
