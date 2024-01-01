import { fetcher } from "./generatedTypes";

export const graphQLClient = <TData>(query: string) =>
  fetcher<TData, unknown>("http://127.0.0.1:8000/graphql", query)();
