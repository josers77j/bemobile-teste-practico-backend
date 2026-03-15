import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string

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

const createRegularUserToken = async () => {
  const email = `regular.${Date.now()}@example.com`
  const password = ['Pass', 'word', '123!'].join('')
  const user = await User.create({
    name: 'Regular User',
    email,
    password,
    role: 'USER',
  })

  const token = await User.accessTokens.create(user)
  return token.value!.release()
}

test.group('Gateways', (group) => {
  group.setup(async () => {
    adminToken = await createAdminToken()
  })

  test('should update gateway priority', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/priority/1')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: 3 })

    assert.equal(response.status(), 200)
    assert.equal(response.body().gateway.priority, 3)
  })

  test('should fail updating to duplicate priority', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/priority/1')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: 2 })

    assert.equal(response.status(), 409)
  })

  test('should toggle gateway active status', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/toggle/1')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.isBoolean(response.body().gateway.isActive)

    await client.patch('/api/v1/gateways/toggle/1').header('authorization', `Bearer ${adminToken}`)
  })

  test('should not update gateway without admin role', async ({ assert, client }) => {
    const userToken = await createRegularUserToken()

    const response = await client
      .patch('/api/v1/gateways/priority/1')
      .header('authorization', `Bearer ${userToken}`)
      .json({ priority: 2 })

    assert.equal(response.status(), 403)
  })

  test('should fail updating gateway without auth', async ({ assert, client }) => {
    const response = await client.patch('/api/v1/gateways/priority/1').json({ priority: 2 })

    assert.equal(response.status(), 401)
  })

  test('should fail with invalid priority value', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/priority/1')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: -1 })

    assert.equal(response.status(), 422)
  })
})
