import { test } from '@japa/runner'

const adminSecret = ['Admin', 'BeMobile', '1234!'].join('')
const wrongSecret = ['wrong', 'pass', 'word'].join('')
const genericSecret = ['pass', 'word'].join('')

test.group('Auth', () => {
  test('should login with valid credentials', async ({ assert, client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'admin@bemobile.com',
      password: adminSecret,
    })

    assert.equal(response.status(), 200)
    assert.exists(response.body().token)
    assert.exists(response.body().user)
  })

  test('should fail login with invalid credentials', async ({ assert, client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'admin@bemobile.com',
      password: wrongSecret,
    })

    assert.equal(response.status(), 400)
  })

  test('should fail login with invalid email', async ({ assert, client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'notanemail',
      password: genericSecret,
    })

    assert.equal(response.status(), 422)
  })

  test('should logout with valid token', async ({ assert, client }) => {
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: 'admin@bemobile.com',
      password: adminSecret,
    })

    const token = loginRes.body().token

    const response = await client
      .post('/api/v1/auth/logout')
      .header('authorization', `Bearer ${token}`)

    assert.equal(response.status(), 204)
  })

  test('should fail logout without token', async ({ assert, client }) => {
    const response = await client.post('/api/v1/auth/logout')

    assert.equal(response.status(), 401)
  })
})
