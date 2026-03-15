import Client from '#models/client'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Product from '#models/product'

import { Exception } from '@adonisjs/core/exceptions'

import GatewayService from '#modules/gateways/services/gateway_service'
import type { CheckoutDto } from '../validators/checkout_validator.ts'
import { inject } from '@adonisjs/core'
import { TransactionStatus } from '#modules/transactions/types/status_type'
@inject()
export default class CheckoutService {
  constructor(private readonly gatewayService: GatewayService) {}

  async process(data: CheckoutDto) {
    // 1. Verificar que todos los productos existen
    const products = await Promise.all(
      data.products.map(async (item) => {
        const product = await Product.find(item.id)
        if (!product) throw new Exception(`Product with id ${item.id} not found`, { status: 422 })
        return { product, quantity: item.quantity }
      })
    )

    // 2. Calcular el monto total
    const amount = products.reduce((total, item) => {
      return total + item.product.amount * item.quantity
    }, 0)

    // 3. Buscar o crear el cliente
    const client = await Client.firstOrCreate(
      { email: data.email },
      { name: data.name, email: data.email }
    )

    // 4. Intentar cobrar con los gateways
    const { externalId, status, gatewayId } = await this.gatewayService.charge({
      amount,
      name: data.name,
      email: data.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    // 5. Guardar la transacción
    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId,
      externalId,
      status: status as TransactionStatus,
      amount,
      cardLastNumbers: data.cardNumber.slice(-4),
    })

    // 6. Guardar los productos de la transacción
    await Promise.all(
      products.map((item) =>
        TransactionProduct.create({
          transactionId: transaction.id,
          productId: item.product.id,
          quantity: item.quantity,
        })
      )
    )

    // 7. Retornar la transacción con relaciones
    return Transaction.query()
      .where('id', transaction.id)
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts', (query) => {
        query.preload('product')
      })
      .firstOrFail()
  }
}
