import Product from '#models/product'

import type { PaginationDto } from '#modules/shared/validators/pagination_validator'

import type { CreateProductDto } from '../validators/create_product_validator.ts'
import type { UpdateProductDto } from '../validators/update_product_validator.ts'

export default class ProductService {
  async index(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination
    return await Product.query().paginate(page, limit)
  }

  async show(id: number) {
    return await Product.findOrFail(id)
  }

  async store(data: CreateProductDto) {
    return await Product.create(data)
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.show(id)
    return await product.merge(data).save()
  }

  async destroy(id: number) {
    const product = await this.show(id)
    await product.delete()
  }
}
