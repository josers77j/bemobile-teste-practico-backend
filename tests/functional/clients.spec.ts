import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string

const createTokenFor = async (email: string) => {
  const user = await User.findByOrFail('email', email)
  const token = await User.accessTokens.create(user)
  return token.value!.release()
}

test.group('Clients', (group) => {
  group.setup(async () => {
    adminToken = await createTokenFor('admin@bemobile.com')
  })

  test('should list all clients', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/clients')
      .header('authorization', `Bearer ${adminToken}`)
      .qs({ page: 1, limit: 10 })

    assert.equal(response.status(), 200)
    assert.exists(response.body().client)
  })

  test('should show client details with all transactions', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/clients/1')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.exists(response.body().client)
    assert.exists(response.body().client.transactions)
  })

  test('should fail showing non-existent client', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/clients/999')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 404)
  })

  test('should not list clients without auth', async ({ assert, client }) => {
    const response = await client.get('/api/v1/clients')

    assert.equal(response.status(), 401)
  })
})
