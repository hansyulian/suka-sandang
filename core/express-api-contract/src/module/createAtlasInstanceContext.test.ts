import express from 'express';

import { createAtlasInstanceContext } from './createAtlasInstanceContext';
import { AtlasInstanceContext } from './types';

describe('createAtlasInstanceContext', () => {
  it('should return an AtlasInstanceContext object with empty contracts and middlewares arrays, and an instance of express', () => {
    const result = createAtlasInstanceContext();
    const expectedContext: AtlasInstanceContext = {
      contracts: [],
      middlewares: [],
      express: expect.any(Function), // Checking if it's a function
    };
    expect(result).toEqual(expectedContext);
  });
});
