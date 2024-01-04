import { isGraphQLReponse } from "@/graphql/utils";
import axios from "axios";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const graphQLBaseAxiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

graphQLBaseAxiosClient.interceptors.response.use((response) => {
  if (isGraphQLReponse(response.data) && response.data.errors.length) {
    return Promise.reject(response.data.errors[0].message);
  }

  return response;
});

export const graphQLClient = <T = any>(query: string) =>
  graphQLBaseAxiosClient.post<T>("", { query });

export const apolloClient = new ApolloClient({
  uri: "http://127.0.0.1:8000/graphql",
  cache: new InMemoryCache(),
});
