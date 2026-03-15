import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string

const createTokenFor = async (email: string) => {
  const user = await User.findByOrFail('email', email)
  const token = await User.accessTokens.create(user)
  return token.value!.release()
}

test.group('Products', (group) => {
  group.setup(async () => {
    adminToken = await createTokenFor('admin@bemobile.com')
  })

  test('should list products', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/products')
      .header('authorization', `Bearer ${adminToken}`)
      .qs({ page: 1, limit: 10 })

    assert.equal(response.status(), 200)
    assert.exists(response.body().product)
  })

  test('should show product by id', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/products/1')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.exists(response.body().product)
  })

  test('should create new product', async ({ assert, client }) => {
    const response = await client
      .post('/api/v1/products')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Test Product',
        amount: 9999,
      })

    assert.equal(response.status(), 201)
    assert.exists(response.body().product)
  })

  test('should update product', async ({ assert, client }) => {
    const response = await client
      .put('/api/v1/products/1')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Updated Product',
        amount: 15000,
      })

    assert.equal(response.status(), 200)
  })

  test('should delete product', async ({ assert, client }) => {
    const createResponse = await client
      .post('/api/v1/products')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: `Delete Product ${Date.now()}`,
        amount: 7777,
      })

    const createBody = createResponse.body()
    if (!('product' in createBody)) {
      assert.fail('Expected created product response')
      return
    }

    const productId = Number((createBody.product as { id: number }).id)

    const response = await client
      .delete(`/api/v1/products/${productId}`)
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 204)
  })

  test('should not create product with missing fields', async ({ assert, client }) => {
    const response = await client
      .post('/api/v1/products')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Test Product',
      })

    assert.equal(response.status(), 422)
  })
})
