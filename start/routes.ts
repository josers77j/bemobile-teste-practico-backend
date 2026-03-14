import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#modules/auth/controllers/auth_controller')
const UserController = () => import('#modules/users/controllers/user_controller')
const ProductsController = () => import('#modules/products/controllers/products_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.get('/', [UserController, 'index'])
        router.get('/:id', [UserController, 'show']).where('id', router.matchers.number())
        router.post('/', [UserController, 'store'])
        router.put('/:id', [UserController, 'update']).where('id', router.matchers.number())
        router.delete('/:id', [UserController, 'destroy']).where('id', router.matchers.number())
      })
      .prefix('users')
      .use([middleware.auth(), middleware.role(['ADMIN', 'MANAGER'])])

    router
      .group(() => {
        router.get('/', [ProductsController, 'index'])
        router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.number())
        router.post('/', [ProductsController, 'store'])
        router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.number())
        router.delete('/:id', [ProductsController, 'destroy']).where('id', router.matchers.number())
      })
      .prefix('products')
      .use([middleware.auth(), middleware.role(['ADMIN', 'MANAGER'])])
  })
  .prefix('/api/v1')
