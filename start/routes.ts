import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { ROLE_TYPE } from '#modules/users/consts/role_type_const'
const AuthController = () => import('#modules/auth/controllers/auth_controller')
const UserController = () => import('#modules/users/controllers/user_controller')
const ProductsController = () => import('#modules/products/controllers/products_controller')
const ClientController = () => import('#modules/clients/controllers/client_controller')
const TransactionController = () =>
  import('#modules/transactions/controllers/transaction_controller')
const GatewayController = () => import('#modules/gateways/controllers/gateway_controller')
const CheckoutController = () => import('#modules/checkout/controllers/checkout_controller')

router
  .group(() => {
    // PUBLIC ROUTES
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
      })
      .prefix('auth')

    router.post('/checkout', [CheckoutController, 'store'])

    router
      .group(() => {
        // USER MODULE
        router
          .group(() => {
            router
              .group(() => {
                router.get('/', [UserController, 'index'])
                router.get('/:id', [UserController, 'show']).where('id', router.matchers.number())
                router.post('/', [UserController, 'store'])
                router.put('/:id', [UserController, 'update']).where('id', router.matchers.number())
              })
              .use(middleware.role([ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER]))
            router
              .delete('/:id', [UserController, 'destroy'])
              .where('id', router.matchers.number())
              .use(middleware.role([ROLE_TYPE.ADMIN]))
          })
          .prefix('users')
        // PRODUCT MODULE
        router
          .group(() => {
            router.get('/', [ProductsController, 'index'])
            router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.number())

            router
              .group(() => {
                router.post('/', [ProductsController, 'store'])
                router
                  .put('/:id', [ProductsController, 'update'])
                  .where('id', router.matchers.number())
              })
              .use(middleware.role([ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER, ROLE_TYPE.FINANCE]))

            router
              .delete('/:id', [ProductsController, 'destroy'])
              .where('id', router.matchers.number())
              .use(middleware.role([ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER]))
          })
          .prefix('/products')

        //CLIENT MODULE
        router
          .group(() => {
            router.get('/', [ClientController, 'index'])
            router.get('/:id', [ClientController, 'show']).where('id', router.matchers.number())
          })
          .prefix('/clients')

        // TRANSACTION MODULE
        router
          .group(() => {
            router.get('/', [TransactionController, 'index'])
            router
              .get('/:id', [TransactionController, 'show'])
              .where('id', router.matchers.number())
            router
              .post('/:id/refund', [TransactionController, 'refund'])
              .where('id', router.matchers.number())
              .use(middleware.role([ROLE_TYPE.FINANCE, ROLE_TYPE.ADMIN]))
          })
          .prefix('/transactions')

        // GATEWAY MODULE
        router
          .group(() => {
            router
              .patch('/priority/:id', [GatewayController, 'updatePriority'])
              .where('id', router.matchers.number())
            router
              .patch('/toggle/:id', [GatewayController, 'toggleActiveStatus'])
              .where('id', router.matchers.number())
          })
          .use(middleware.role([ROLE_TYPE.ADMIN]))
          .prefix('/gateways')
      })
      .use([middleware.auth()])
  })
  .prefix('/api/v1')
