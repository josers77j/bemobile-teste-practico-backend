/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'checkout.store': {
    methods: ["POST"],
    pattern: '/api/v1/checkout',
    tokens: [{"old":"/api/v1/checkout","type":0,"val":"api","end":""},{"old":"/api/v1/checkout","type":0,"val":"v1","end":""},{"old":"/api/v1/checkout","type":0,"val":"checkout","end":""}],
    types: placeholder as Registry['checkout.store']['types'],
  },
  'user.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['user.index']['types'],
  },
  'user.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.show']['types'],
  },
  'user.store': {
    methods: ["POST"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['user.store']['types'],
  },
  'user.update': {
    methods: ["PUT"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.update']['types'],
  },
  'user.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user.destroy']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.show']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/api/v1/products',
    tokens: [{"old":"/api/v1/products","type":0,"val":"api","end":""},{"old":"/api/v1/products","type":0,"val":"v1","end":""},{"old":"/api/v1/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.update': {
    methods: ["PUT"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/products/:id',
    tokens: [{"old":"/api/v1/products/:id","type":0,"val":"api","end":""},{"old":"/api/v1/products/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/products/:id","type":0,"val":"products","end":""},{"old":"/api/v1/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'client.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients',
    tokens: [{"old":"/api/v1/clients","type":0,"val":"api","end":""},{"old":"/api/v1/clients","type":0,"val":"v1","end":""},{"old":"/api/v1/clients","type":0,"val":"clients","end":""}],
    types: placeholder as Registry['client.index']['types'],
  },
  'client.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/clients/:id',
    tokens: [{"old":"/api/v1/clients/:id","type":0,"val":"api","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/clients/:id","type":0,"val":"clients","end":""},{"old":"/api/v1/clients/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['client.show']['types'],
  },
  'transaction.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/transactions',
    tokens: [{"old":"/api/v1/transactions","type":0,"val":"api","end":""},{"old":"/api/v1/transactions","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transaction.index']['types'],
  },
  'transaction.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/transactions/:id',
    tokens: [{"old":"/api/v1/transactions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/transactions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/api/v1/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transaction.show']['types'],
  },
  'transaction.refund': {
    methods: ["POST"],
    pattern: '/api/v1/transactions/:id/refund',
    tokens: [{"old":"/api/v1/transactions/:id/refund","type":0,"val":"api","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"v1","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"transactions","end":""},{"old":"/api/v1/transactions/:id/refund","type":1,"val":"id","end":""},{"old":"/api/v1/transactions/:id/refund","type":0,"val":"refund","end":""}],
    types: placeholder as Registry['transaction.refund']['types'],
  },
  'gateway.update_priority': {
    methods: ["PATCH"],
    pattern: '/api/v1/gateways/priority/:id',
    tokens: [{"old":"/api/v1/gateways/priority/:id","type":0,"val":"api","end":""},{"old":"/api/v1/gateways/priority/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/gateways/priority/:id","type":0,"val":"gateways","end":""},{"old":"/api/v1/gateways/priority/:id","type":0,"val":"priority","end":""},{"old":"/api/v1/gateways/priority/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['gateway.update_priority']['types'],
  },
  'gateway.toggle_active_status': {
    methods: ["PATCH"],
    pattern: '/api/v1/gateways/toggle/:id',
    tokens: [{"old":"/api/v1/gateways/toggle/:id","type":0,"val":"api","end":""},{"old":"/api/v1/gateways/toggle/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/gateways/toggle/:id","type":0,"val":"gateways","end":""},{"old":"/api/v1/gateways/toggle/:id","type":0,"val":"toggle","end":""},{"old":"/api/v1/gateways/toggle/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['gateway.toggle_active_status']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
