const config = useRuntimeConfig()

/*
Redirect all requests using this middleware to the site root if the UAT Actions navigation item
is not among the enabled routes.
 */
export default defineNuxtRouteMiddleware(() => {
  const enabledNavItems = selectNavItems(config.public.enabledNavItems)

  if (!enabledNavItems.find((item: { path: string }) => item.path.startsWith('/uat_actions/'))) {
    return navigateTo('/')
  }
})
