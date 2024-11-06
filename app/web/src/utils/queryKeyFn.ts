/* eslint-disable @typescript-eslint/no-explicit-any */
export const queryKeyFn = {
  simple,
  many,
  single,
  option,
};

function many(group: string) {
  return (_params: any, query: any) => {
    return [group, query];
  };
}

function simple(group: string) {
  return () => {
    return [group];
  };
}

function single(group: string) {
  return (params: any) => {
    return [params, group];
  };
}

function option(group: string, option: string = "options") {
  return () => {
    return [group, option];
  };
}
