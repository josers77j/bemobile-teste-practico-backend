import { test } from '@japa/runner'

test.group('Checkout', () => {
  test('should create transaction with valid checkout data', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'customer@example.com',
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
    })

    assert.equal(response.status(), 201)
    assert.exists(response.body().transaction)
    assert.exists(response.body().transaction.id)
    assert.exists(response.body().transaction.client)
    assert.exists(response.body().transaction.gateway)
  })

  test('should create or retrieve existing client on checkout', async ({ assert, client }) => {
    const email = 'duplicate@example.com'

    const response1 = await client.post('/api/v1/checkout').json({
      name: 'Customer One',
      email,
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ id: 1, quantity: 1 }],
    })

    const response2 = await client.post('/api/v1/checkout').json({
      name: 'Customer Two',
      email,
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ id: 2, quantity: 1 }],
    })

    assert.equal(response1.status(), 201)
    assert.equal(response2.status(), 201)
    assert.equal(response1.body().transaction.client.email, email)
    assert.equal(response2.body().transaction.client.email, email)
  })

  test('should fail checkout with invalid card number', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'customer@example.com',
      cardNumber: '1234',
      cvv: '010',
      products: [{ id: 1, quantity: 1 }],
    })

    assert.equal(response.status(), 422)
  })

  test('should fail checkout with invalid cvv', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'customer@example.com',
      cardNumber: '5569000000006063',
      cvv: '12',
      products: [{ id: 1, quantity: 1 }],
    })

    assert.equal(response.status(), 422)
  })

  test('should fail checkout with non-existent product', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'customer@example.com',
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ id: 999, quantity: 1 }],
    })

    assert.equal(response.status(), 422)
  })

  test('should fail checkout without products', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'customer@example.com',
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [],
    })

    assert.equal(response.status(), 422)
  })

  test('should fail checkout with invalid email', async ({ assert, client }) => {
    const response = await client.post('/api/v1/checkout').json({
      name: 'Test Customer',
      email: 'notanemail',
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ id: 1, quantity: 1 }],
    })

    assert.equal(response.status(), 422)
  })
})
