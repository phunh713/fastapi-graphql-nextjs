import { Query } from "@/graphql/convertedStrapiTypes";
import {
  MapRemove,
  Query as GraphQLQuery,
  PureObject,
  RemoveKey,
  Mutation as GraphQLMutation,
  MapQuery,
  GraphQLResponse,
} from "@/graphql/interface";
import { queryBuilder } from "@/graphql/utils";
import axios, { AxiosResponse } from "axios";
import { cache } from "react";

const baseClient = axios.create({
  baseURL: "https://paf-dev.tpptechnology.com/strapi/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

export const strapiQueryClient = cache(async <T extends GraphQLQuery<Query>>(rawQuery: T) => {
  const query = queryBuilder<Query>(rawQuery);
  const result = await baseClient.post("", { query });
  return result as AxiosResponse<
    GraphQLResponse<
      T extends {
        query: infer U;
      }
        ? U extends PureObject
          ? MapQuery<RemoveKey<MapRemove<U>>, Query>
          : never
        : never
    >
  >;
});
