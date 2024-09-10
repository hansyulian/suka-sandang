export type BaseAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type MutationOmit<T, K extends keyof T = never> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | K
>;
