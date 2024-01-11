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

const baseClient = axios.create({
  baseURL: "http://172.16.2.186:1337/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

export const strapiQueryClient = async <T extends GraphQLQuery<Query>>(rawQuery: T) => {
  const query = queryBuilder<Query>(rawQuery);
  console.log(query);
  const result = await baseClient.post("", { query });
  console.log(result);
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
};
