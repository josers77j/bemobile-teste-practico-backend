/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
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
}
