import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import { PaginationValidator } from '#modules/shared/validators/pagination_validator'

import ProductService from '../services/products_service.ts'
import { UpdateProductValidator } from '../validators/update_product_validator.ts'
import { CreateProductValidator } from '../validators/create_product_validator.ts'
// import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class ProductsController {
  constructor(private readonly productService: ProductService) {}

  async index({ request, response }: HttpContext) {
    const pagination = await request.validateUsing(PaginationValidator)
    const product = await this.productService.index(pagination)
    return response.ok({ product })
  }

  async show({ params, response }: HttpContext) {
    const id = params.id
    const product = await this.productService.show(id)

    return response.ok({ product })
  }
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(CreateProductValidator)
    const product = await this.productService.store(data)
    return response.ok({ product })
  }

  async update({ params, request, response }: HttpContext) {
    const id = params.id
    const data = await request.validateUsing(UpdateProductValidator)
    const product = await this.productService.update(id, data)
    return response.ok({ product })
  }

  async destroy({ params, response }: HttpContext) {
    const id = params.id
    await this.productService.destroy(id)
    response.noContent()
  }
}
