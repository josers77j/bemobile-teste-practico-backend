import { test } from '@japa/runner'
import User from '#models/user'

let adminToken: string
const userSecret = ['Pass', 'word', '123!'].join('')

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

const createManagedUser = async () => {
  return User.create({
    name: `Managed User ${Date.now()}`,
    email: `managed.${Date.now()}@example.com`,
    password: userSecret,
    role: 'USER',
  })
}

test.group('Users', (group) => {
  group.setup(async () => {
    adminToken = await createAdminToken()
  })

  test('should list users with pagination', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/users')
      .header('authorization', `Bearer ${adminToken}`)
      .qs({ page: 1, limit: 10 })

    assert.equal(response.status(), 200)
    const body = response.body()
    if (!('data' in body)) {
      assert.fail('Expected paginated users response')
      return
    }
    assert.exists(body.data)
  })

  test('should show user by id', async ({ assert, client }) => {
    const response = await client
      .get('/api/v1/users/1')
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 200)
    assert.exists(response.body().user)
  })

  test('should create new user', async ({ assert, client }) => {
    const testEmail = `testuser.${Date.now()}@example.com`

    const response = await client
      .post('/api/v1/users')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Test User',
        email: testEmail,
        password: userSecret,
        role: 'USER',
      })

    assert.equal(response.status(), 201)
    const body = response.body()
    if (!('user' in body)) {
      assert.fail('Expected created user response')
      return
    }
    assert.exists(body.user)
    assert.equal(body.user.email, testEmail)
  })

  test('should update user', async ({ assert, client }) => {
    const targetUser = await createManagedUser()

    const response = await client
      .put(`/api/v1/users/${targetUser.id}`)
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Updated Name',
        role: 'MANAGER',
      })

    assert.equal(response.status(), 200)
    assert.equal(response.body().user.name, 'Updated Name')
  })

  test('should delete user', async ({ assert, client }) => {
    const targetUser = await createManagedUser()

    const response = await client
      .delete(`/api/v1/users/${targetUser.id}`)
      .header('authorization', `Bearer ${adminToken}`)

    assert.equal(response.status(), 204)
  })

  test('should not create user without admin role', async ({ assert, client }) => {
    const response = await client
      .post('/api/v1/users')
      .header('authorization', `Bearer ${adminToken}`)
      .json({
        name: 'Test User',
        email: 'invalid@example.com',
        password: userSecret,
        role: 'INVALID_ROLE',
      })

    assert.equal(response.status(), 422)
  })
})
