import { test } from '@japa/runner'
import User from '#models/user'
import Transaction from '#models/transaction'

let adminToken: string

const createRegularUserToken = async () => {
  const email = `txn.user.${Date.now()}@example.com`
  const password = ['Pass', 'word', '123!'].join('')
  const user = await User.create({
    name: 'Transaction User',
    email,
    password,
    role: 'USER',
  })

  const token = await User.accessTokens.create(user)
  return token.value!.release()
}

const createAdminToken = async () => {
  const password = ['Admin', 'BeMobile', '1234!'].join('')
  const admin = await User.updateOrCreate(
    { email: 'admin@bemobile.com' },
    {
      name: 'Admin',
      email: 'admin@bemobile.com',
      password,
      role: 'ADMIN',
    }
  )

  const token = await User.accessTokens.create(admin)
  return token.value!.release()
}

const createPaidTransactionId = async (client: any, assert: any) => {
  const checkoutResponse = await client.post('/api/v1/checkout').json({
    name: 'Refund Customer',
    email: `refund.${Date.now()}@example.com`,
    cardNumber: '5569000000006063',
    cvv: '010',
    products: [{ id: 1, quantity: 1 }],
  })

  assert.equal(checkoutResponse.status(), 201)
  const transactionId = checkoutResponse.body().transaction.id as number

  const transaction = await Transaction.findOrFail(transactionId)
  transaction.status = 'paid'
  await transaction.save()

  return transactionId
}

test.group('Transactions', (group) => {
  group.setup(async () => {
    adminToken = await createAdminToken()
  })

  test('should list all transactions', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/transactions')
      .header('authorization', `Bearer ${adminToken}`)
      .qs({ page: 1, limit: 10 })

    assert.equal(response.status(), 200)
    assert.exists(response.body().transactions)
  })

  test('should show transaction details', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/transactions/1')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.exists(response.body().transaction)
    assert.exists(response.body().transaction.client)
    assert.exists(response.body().transaction.gateway)
    assert.exists(response.body().transaction.transactionProducts)
  })

  test('should refund a paid transaction', async ({ assert, client }) => {
    const transactionId = await createPaidTransactionId(client, assert)

    const response = await client
      .post(`/api/v1/transactions/${transactionId}/refund`)
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.equal(response.body().transaction.status, 'refunded')
  })

  test('should not refund without admin/finance role', async ({ assert, client }) => {
    const userToken = await createRegularUserToken()

    const checkoutResponse = await client.post('/api/v1/checkout').json({
      name: 'Forbidden Refund Customer',
      email: `forbidden.refund.${Date.now()}@example.com`,
      cardNumber: '5569000000006063',
      cvv: '010',
      products: [{ id: 1, quantity: 1 }],
    })

    assert.equal(checkoutResponse.status(), 201)
    const transactionId = checkoutResponse.body().transaction.id

    const response = await client
      .post(`/api/v1/transactions/${transactionId}/refund`)
      .header('authorization', `Bearer ${userToken}`)

    assert.equal(response.status(), 403)
  })

  test('should fail refunding non-existent transaction', async ({ assert, client }) => {
    const response = await client
      .post('/api/v1/transactions/999/refund')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 404)
  })

  test('should not list transactions without auth', async ({ assert, client }) => {
    const response = await client.get('/api/v1/transactions')

    assert.equal(response.status(), 401)
  })
})
