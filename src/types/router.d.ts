import 'vue-router';
export {};

declare module 'vue-router' {
  interface RouteMeta {
    // must be declared by every route
    requiresAuth: boolean;
    layout: string;
  }

  // Custom property we attach at runtime to carry bootstrapped auth data
  interface Router {
    authUser: unknown | null;
  }
}
