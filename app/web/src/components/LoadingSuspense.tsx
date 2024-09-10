import { PropsWithChildren, Suspense } from "react";

export type LoadingSuspenseProps = PropsWithChildren;

export const LoadingSuspense = (props: LoadingSuspenseProps) => {
  return <Suspense fallback={null} {...props} />;
};
