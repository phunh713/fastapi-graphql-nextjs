import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "./config";
import { GraphQLResponse } from "@/graphql/interface";
import { useEffect } from "react";

export const useGraphQLQuery = <T>(queryString?: string) => {
  const query = useQuery({
    queryKey: ["GRAPHQL_QUERY", queryString],
    queryFn: () => {
      if (!queryString) return Promise.reject(new Error("Invalid ID"));
      return graphQLClient<GraphQLResponse<T>>(queryString);
    },
    select: (res) => res.data.data,
    enabled: !!queryString,
    retry: 0,
  });

  useEffect(() => {
    if (query.isError) {
      console.log("GRAPHQL QUERY ERROR: ", query.error);
    }
  }, [query]);

  return query;
};
