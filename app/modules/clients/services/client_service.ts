import Client from '#models/client'
import type { PaginationDto } from '#modules/shared/validators/pagination_validator'

export default class ClientService {
  async index(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination
    return await Client.query().paginate(page, limit)
  }

  async show(id: number) {
    return await Client.query()
      .where('id', id)
      .preload('transactions', (query) => {
        query.preload('gateway').preload('transactionProducts', (q) => {
          q.preload('product')
        })
      })
      .firstOrFail()
  }
}
