import { createAtlasInstanceContext } from './createAtlasInstanceContext';
import { createRegisterRouterMiddleware } from './createRegisterRouterMiddleware';

describe('@base/atlas.createRegisterMiddleware', () => {
  it('Should be able to strict typing the middleware', () => {
    const context = createAtlasInstanceContext();
    const registerMiddleware = createRegisterRouterMiddleware<{
      stringParam: string;
      numberParam: number;
    }>('/sample/path', context);
    registerMiddleware(async function ({ params }) {
      const result = `${params.stringParam.toLocaleLowerCase()} ${params.numberParam.toExponential()}`;
    });
    expect(context.middlewares.length).toStrictEqual(1);
    expect(context.middlewares[0].path).toStrictEqual('sample/path');
    expect(context.middlewares[0].method).toStrictEqual('all');
  });
});
