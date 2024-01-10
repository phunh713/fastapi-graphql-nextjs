import { Query } from "@/graphql/convertedStrapiTypes";
import {
  MapRemove,
  Query as GraphQLQuery,
  PureObject,
  RemoveKey,
  Mutation as GraphQLMutation,
} from "@/graphql/interface";
import axios from "axios";

const baseClient = axios.create({
  baseURL: "http://localhost:1337/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

export const strapiQueryClient = <T extends GraphQLQuery<Query>>(query: T) => {
  const b: PureObject = {
    query: {
      fields: {
        athor: true,
      },
    },
  };
  return b as T extends {
    query: infer U;
  }
    ? U extends PureObject
      ? RemoveKey<MapRemove<U>>
      : {}
    : {};
};
const obj = strapiQueryClient({
  query: {
    blog: {
      variables: { id: "1" },
      fields: {
        data: {
          fields: {
            id: true,
            attributes: {
              fields: {
                Author: true,
              },
            },
          },
        },
      },
    },
    blogs: {
      variables: {},
      fields: {
        data: {
          fields: {
            id: true,
            attributes: {
              fields: {
                Author: true,
              },
            },
          },
        },
      },
    },
  },
});
