import { AnyRoute, createRoute } from '@tanstack/react-router';
import { LandingScreen } from '~/routes/Landing/LandingScreen';

export function indexRouter<TParent extends AnyRoute>(
  getRootRoute: () => TParent,
) {
  const route = createRoute({
    getParentRoute: getRootRoute,
    id: 'landing',
  });
  const getParentRoute = () => route;
  const routes = {
    index: createRoute({
      getParentRoute,
      path: '/',
      component: LandingScreen,
    }),
  };
  return route.addChildren([routes.index]);
}
