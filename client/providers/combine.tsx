import React from "react";

type AllowedProvider =
  | React.FC
  | React.ComponentClass<{ children?: React.ReactNode }>
  | React.ComponentType
  | React.ForwardRefExoticComponent<any>;
type FilteredOutProvider = false | undefined;

type ProviderList = Array<AllowedProvider | FilteredOutProvider>;

export const combine = (
  base: ProviderList,
  list: ProviderList,
  children: React.ReactNode,
) => {
  const independenceProviders = (
    base.filter(Boolean) as Array<AllowedProvider>
  ).map((Provider, index) => <Provider key={index} />);
  return (
    <>
      {(list.filter(Boolean) as Array<AllowedProvider>).reduceRight(
        (acc, Provider) => (
          <Provider>{acc}</Provider>
        ),
        <>
          {independenceProviders}
          {children}
        </>,
      )}
    </>
  );
};
