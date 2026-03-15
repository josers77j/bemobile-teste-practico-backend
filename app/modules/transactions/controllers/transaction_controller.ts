import { inject } from '@adonisjs/core'
import TransactionService from '../services/transaction_service.ts'
import { HttpContext } from '@adonisjs/core/http'
import { PaginationValidator } from '#modules/shared/validators/pagination_validator'
@inject()
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async index({ request, response }: HttpContext) {
    const pagination = await request.validateUsing(PaginationValidator)
    const transactions = await this.transactionService.index(pagination)
    return response.ok({ transactions })
  }

  async show({ params, response }: HttpContext) {
    const id = Number(params.id)
    const transaction = await this.transactionService.show(id)
    return response.ok({ transaction })
  }

  async refund({ params, response }: HttpContext) {
    const id = Number(params.id)
    const transaction = await this.transactionService.refund(id)
    return response.ok({ transaction })
  }
}
