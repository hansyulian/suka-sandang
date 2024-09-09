import { Loader } from "@mantine/core";
import { PropsWithChildren, Suspense } from "react";

export type LoadingSuspenseProps = PropsWithChildren;

export const LoadingSuspense = (props: LoadingSuspenseProps) => {
  return <Suspense fallback={<Loader />} {...props} />;
};
