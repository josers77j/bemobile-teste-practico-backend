/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  checkout: {
    store: typeof routes['checkout.store']
  }
  user: {
    index: typeof routes['user.index']
    show: typeof routes['user.show']
    store: typeof routes['user.store']
    update: typeof routes['user.update']
    destroy: typeof routes['user.destroy']
  }
  products: {
    index: typeof routes['products.index']
    show: typeof routes['products.show']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  client: {
    index: typeof routes['client.index']
    show: typeof routes['client.show']
  }
  transaction: {
    index: typeof routes['transaction.index']
    show: typeof routes['transaction.show']
    refund: typeof routes['transaction.refund']
  }
  gateway: {
    updatePriority: typeof routes['gateway.update_priority']
    toggleActiveStatus: typeof routes['gateway.toggle_active_status']
  }
}
