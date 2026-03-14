/**
 * Quick test to debug verifyCredentials without running full server
 */
import '@poppinss/ts-exec'
import app from '#services/app'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

await app.setup()

try {
  console.log('Testing verifyCredentials...')
  console.log('Email: granillo@gmail.com')
  console.log('Password: administrador12343')

  // Test 1: Check if user exists
  const user = await User.findBy('email', 'granillo@gmail.com')
  if (!user) {
    console.error('❌ User not found in database')
    process.exit(1)
  }
  console.log('✓ User found:', user.email)
  console.log('  Password hash starts with:', user.password.substring(0, 30))
  console.log('  Password hash length:', user.password.length)

  // Test 2: Try manual hash comparison
  const manualMatch = await hash.use('scrypt').verify(user.password, 'administrador12343')
  console.log('\n✓ Manual hash verification:', manualMatch ? '✅ MATCH' : '❌ NO MATCH')

  // Test 3: Try verifyCredentials
  console.log('\nCalling User.verifyCredentials...')
  const verified = await User.verifyCredentials('granillo@gmail.com', 'administrador12343')
  console.log('✓ verifyCredentials returned:', verified.email)

  console.log('\n✅ All tests passed!')
} catch (err) {
  console.error('\n❌ Error:', err.message)
  console.error('Code:', err.code)
  console.error('Stack:', err.stack)
} finally {
  await app.shutdown()
}
