import Transaction from '#models/transaction'
import type { PaginationDto } from '#modules/shared/validators/pagination_validator'
import GatewayService from '#modules/gateways/services/gateway_service'
import { inject } from '@adonisjs/core'

@inject()
export default class TransactionService {
  constructor(private readonly gatewayService: GatewayService) {}

  async index(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination
    return await Transaction.query().preload('client').preload('gateway').paginate(page, limit)
  }

  async show(id: number) {
    return await Transaction.query()
      .where('id', id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .firstOrFail()
  }

  async refund(id: number) {
    const transaction = await this.show(id)

    if (transaction.status === 'refunded') {
      throw new Error('Transaction already refunded')
    }

    if (transaction.status !== 'paid') {
      throw new Error('Only paid transactions can be refunded')
    }

    await this.gatewayService.refund(transaction.gateway.name, transaction.externalId)

    transaction.status = 'refunded'
    await transaction.save()

    const updated = await this.show(id)
    return updated
  }
}
