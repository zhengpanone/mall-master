import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    isAdmin?: boolean
    requireAuth?: boolean
  }
}
