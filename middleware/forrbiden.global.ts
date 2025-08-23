import { useRuntimeConfig } from '#app';
import { withoutTrailingSlash } from 'ufo';

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isBetaMode = config.public.betaMode;

  // Routes privées
  const privateRoutes = [
    '/about', '/contact', '/legal', '/pricing'
  ].map(route => withoutTrailingSlash(route));
  
  // Normalisation du chemin de la route pour ne pas avoir de problème avec les slashes
  const normalizedPath = withoutTrailingSlash(to.path);
  
  // Si le mode bêta est activé
  if (isBetaMode) {
    const isDashboardRoute = normalizedPath.startsWith('/db');
    const isPrivate = privateRoutes.includes(normalizedPath);

    // Rediriger vers la page d'erreur 403.
    if (!isDashboardRoute && isPrivate) {
      return navigateTo('/403');
    }
  }
});
