import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ProductSeeder extends BaseSeeder {
  async run() {
    await Product.createMany([
      { name: 'Produto 1', amount: 1000 },
      { name: 'Produto 2', amount: 2500 },
      { name: 'Produto 3', amount: 5000 },
    ])
  }
}
