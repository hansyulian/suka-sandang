export type BaseAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type CreateOmit<T, K extends keyof T = never> = Omit<
  T,
  keyof BaseAttributes | K
> &
  Partial<BaseAttributes>;

// UpdateOmit reuses CreateOmit and additionally omits "id"
export type UpdateOmit<T, K extends keyof T = never> = Omit<
  Partial<T>,
  keyof BaseAttributes | K
>;
