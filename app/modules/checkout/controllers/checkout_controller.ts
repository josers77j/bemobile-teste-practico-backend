import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CheckoutService from '../services/checkout_service.ts'
import { CheckoutValidator } from '../validators/checkout_validator.ts'
@inject()
export default class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CheckoutValidator)
    const transaction = await this.checkoutService.process(data)
    return response.created({ transaction })
  }
}
