import { test } from '@japa/runner'
import Gateway from '#models/gateway'
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

  group.teardown(async () => {
    const gateway1 = await Gateway.findBy('name', 'Gateway1')
    const gateway2 = await Gateway.findBy('name', 'Gateway2')

    if (gateway1) {
      gateway1.priority = 1
      gateway1.isActive = true
      await gateway1.save()
    }

    if (gateway2) {
      gateway2.priority = 2
      gateway2.isActive = true
      await gateway2.save()
    }
  })

  test('should update gateway priority', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/1/priority')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: 3 })

    assert.equal(response.status(), 200)
    assert.equal(response.body().gateway.priority, 3)
  })

  test('should fail updating to duplicate priority', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/1/priority')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: 2 })

    assert.equal(response.status(), 409)
  })

  test('should toggle gateway active status', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/1/toggle')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.isBoolean(response.body().gateway.isActive)

    await client.patch('/api/v1/gateways/1/toggle').header('authorization', `Bearer ${adminToken}`)
  })

  test('should not update gateway without admin role', async ({ assert, client }) => {
    const userToken = await createRegularUserToken()

    const response = await client
      .patch('/api/v1/gateways/1/priority')
      .header('authorization', `Bearer ${userToken}`)
      .json({ priority: 2 })

    assert.equal(response.status(), 403)
  })

  test('should fail updating gateway without auth', async ({ assert, client }) => {
    const response = await client.patch('/api/v1/gateways/1/priority').json({ priority: 2 })

    assert.equal(response.status(), 401)
  })

  test('should fail with invalid priority value', async ({ assert, client }) => {
    const response = await client
      .patch('/api/v1/gateways/1/priority')
      .header('authorization', `Bearer ${adminToken}`)
      .json({ priority: -1 })

    assert.equal(response.status(), 422)
  })
})
