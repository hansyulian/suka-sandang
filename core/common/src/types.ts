export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type KeyValuePair<T = unknown> = Record<string, T>;
export type Optional<T, K extends keyof T = never> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<
    T[K],
    undefined
  >;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
