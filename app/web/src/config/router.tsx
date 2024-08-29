import {
  createRootRouteWithContext,
  createRouter,
} from '@tanstack/react-router';
import { MasterLayout } from '~/components/MasterLayout';
import { indexRouter } from '~/routes/Landing';

type AppRouteContext = {
  sampleHandsome: boolean;
};

export const rootRoute = createRootRouteWithContext<AppRouteContext>()({
  component: MasterLayout,
});

const getRootRoute = () => rootRoute;
const routeTree = rootRoute.addChildren([indexRouter(getRootRoute)]);

export const router = createRouter({
  routeTree,
  context: {
    sampleHandsome: true,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
