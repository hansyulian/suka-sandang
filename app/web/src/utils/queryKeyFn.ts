/* eslint-disable @typescript-eslint/no-explicit-any */
export const queryKeyFn = {
  simple,
  many,
  single,
  option,
};

function many(group: string) {
  return (params?: any, query?: any) => {
    return [
      group,
      "many",
      {
        ...params,
        ...query,
      },
    ];
  };
}

function simple(group: string) {
  return () => {
    return [group, "simple"];
  };
}

function single(group: string) {
  return (params: any) => {
    return [group, "single", params];
  };
}

function option(group: string, option: string = "options") {
  return () => {
    return [group, "option", option];
  };
}
